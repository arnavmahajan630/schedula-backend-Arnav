import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { DoctorTimeSlot } from 'src/doctor/entities/doctor-time-slot.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { TimeSlotStatus } from 'src/doctor/enums/availability.enums';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { ScheduleType } from 'src/doctor/enums/schedule-type.enums';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private DoctorRepo: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(DoctorTimeSlot)
    private timeSlotRepo: Repository<DoctorTimeSlot>,
  ) {}

  async createAppointment(patientId: number, dto: CreateAppointmentDto) {
    // Find the patient
    try {
      const doctor = await this.DoctorRepo.findOne({
        where: { user_id: dto.doctor_id },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      const patient = await this.patientRepo.findOne({
        where: { user_id: patientId },
      });
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const scheduleType = doctor.schedule_type;

      const timeSlot = await this.timeSlotRepo.findOne({
        where: {
          doctor: { user_id: dto.doctor_id },
          date: dto.date,
          startTime: dto.start_time,
          endTime: dto.end_time,
        },
      });
      if (!timeSlot) {
        throw new NotFoundException('Time slot not found');
      }
      if (timeSlot.status !== TimeSlotStatus.AVAILABLE) {
        throw new ConflictException('Time slot is not available');
      }

      // For STREAM schedule type.
      if (scheduleType === ScheduleType.STREAM) {
        // Check if patient already has an appointment for this time slot
        const existingAppointment = await this.appointmentRepo.findOne({
          where: {
            doctor: { user_id: dto.doctor_id },
            patient: { user_id: patientId },
            time_slot: timeSlot,
            appointment_status: AppointmentStatus.SCHEDULED,
          },
        });
        if (existingAppointment) {
          throw new ConflictException(
            'Patient already has an appointment for this time slot',
          );
        }

        const appointment = this.appointmentRepo.create({
          patient: { user_id: patientId },
          doctor: { user_id: dto.doctor_id },
          time_slot: timeSlot,
          appointment_status: AppointmentStatus.SCHEDULED,
          scheduled_on: new Date(),
        });
        await this.appointmentRepo.save(appointment);

        // Update the time slot status to BOOKED
        timeSlot.status = TimeSlotStatus.BOOKED;
        await this.timeSlotRepo.save(timeSlot);
        return {
          message: 'Appointment created successfully',
          data: { appointment },
        };
      }

      // For WAVE schedule type.
      if (scheduleType === ScheduleType.WAVE) {
        // Check if patient already has an appointment for this slotj
        const existingPatientAppointment = await this.appointmentRepo.findOne({
          where: {
            patient: { user_id: patientId },
            time_slot: { timeslot_id: timeSlot.timeslot_id },
            appointment_status: AppointmentStatus.SCHEDULED,
          },
        });

        if (existingPatientAppointment) {
          throw new ConflictException(
            'Patient already has an appointment for this time slot',
          );
        }

        const existingAppointments = await this.appointmentRepo.find({
          where: {
            doctor: { user_id: dto.doctor_id },
            time_slot: { timeslot_id: timeSlot.timeslot_id },
            appointment_status: AppointmentStatus.SCHEDULED,
          },
        });

        const maxPatients = timeSlot.maxPatients || 3;
        const currentBookings = existingAppointments.length;

        if (currentBookings >= maxPatients) {
          throw new ConflictException(
            `Time slot has reached maximum capacity of ${maxPatients} patients`,
          );
        }

        const appointment = this.appointmentRepo.create({
          patient: { user_id: patientId },
          doctor: { user_id: dto.doctor_id },
          time_slot: timeSlot,
          appointment_status: AppointmentStatus.SCHEDULED,
          scheduled_on: new Date(),
        });

        await this.appointmentRepo.save(appointment);

        // Update slot status if it reaches capacity
        if (currentBookings + 1 >= maxPatients) {
          timeSlot.status = TimeSlotStatus.BOOKED;
          await this.timeSlotRepo.save(timeSlot);
        }
        return {
          message: 'Appointment created successfully',
          data: { appointment },
        };
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error; // Re-throw known exceptions
      }
      throw new InternalServerErrorException();
    }
  }
}
