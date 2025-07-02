import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { DoctorTimeSlot } from 'src/doctor/entities/doctor-time-slot.entity';
import { TimeSlotStatus } from 'src/doctor/enums/availability.enums';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { CreateAppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(DoctorTimeSlot)
    private timeSlotRepo: Repository<DoctorTimeSlot>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async createAppointment(patientId: number, dto: CreateAppointmentDto) {
    try {
      const { doctor_id, timeslot_id } = dto;

      const timeSlot = await this.timeSlotRepo.findOne({
        where: { timeslot_id },
        relations: ['doctor', 'doctor.user'],
      });
      if (!timeSlot) {
        throw new NotFoundException('Time slot not found');
      }

      if (timeSlot.doctor.user_id !== doctor_id) {
        throw new BadRequestException(
          'Time slot does not belong to this doctor',
        );
      }

      const patient = await this.patientRepo.findOne({
        where: { user_id: patientId },
        relations: ['user'],
      });
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      if (timeSlot.status !== TimeSlotStatus.AVAILABLE) {
        throw new ConflictException('Time slot is no longer available');
      }

      const { doctor, ...timeSlotWithoutDoctor } = timeSlot;

      const existingAppointmentInSession = await this.appointmentRepo.findOne({
        where: {
          patient: { user_id: patientId },
          time_slot: {
            doctor: { user_id: doctor.user_id },
            date: timeSlot.date,
            session: timeSlot.session,
          },
        },
      });

      if (existingAppointmentInSession) {
        throw new ConflictException(
          'You already have an appointment with this doctor in this session.',
        );
      }

      const existingAppointmentsCount = await this.appointmentRepo.count({
        where: { time_slot: { timeslot_id: timeSlot.timeslot_id } },
      });

      if (existingAppointmentsCount >= timeSlot.max_patients) {
        throw new ConflictException('This time slot is already full.');
      }

      const reporting_time = this.calculateReportingTime(
        timeSlot,
        existingAppointmentsCount,
      );

      const appointment = this.appointmentRepo.create({
        doctor,
        patient,
        time_slot: timeSlot,
        appointment_status: AppointmentStatus.SCHEDULED,
        scheduled_on: new Date(),
      });

      await this.appointmentRepo.save(appointment);

      if (existingAppointmentsCount + 1 >= timeSlot.max_patients) {
        timeSlot.status = TimeSlotStatus.BOOKED;
        await this.timeSlotRepo.save(timeSlot);
      }

      return {
        message: 'Appointment booked successfully',
        data: {
          reporting_time,
          ...appointment,
          doctor: {
            ...doctor,
            user: { profile: doctor.user.profile },
          },
          patient: {
            ...patient,
            user: { profile: patient.user.profile },
          },
          time_slot: timeSlotWithoutDoctor,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error creating appointment:', error);
      throw new InternalServerErrorException('Error creating appointment');
    }
  }

  private calculateReportingTime(
    timeSlot: DoctorTimeSlot,
    patientIndex: number,
  ): string {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const toStr = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    };

    const startMins = toMin(timeSlot.start_time);
    const endMins = toMin(timeSlot.end_time);
    const totalDuration = endMins - startMins;

    const timePerPatient = totalDuration / timeSlot.max_patients;

    const reportingTimeMins = startMins + timePerPatient * patientIndex;

    return toStr(reportingTimeMins);
  }
}
