import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { CreateDoctorAvailabilityDto } from './dto/create-availabilty.dto';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorTimeSlot } from './entities/doctor-time-slot.entity';
import { TimeSlotStatus } from './enums/availability.enums';
import { ScheduleType } from './enums/schedule-type.enums';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(DoctorTimeSlot)
    private timeSlotRepo: Repository<DoctorTimeSlot>,
  ) {}

  async getProfile(doctorId: number) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { user_id: doctorId },
        relations: ['user'],
      });
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      const doctorWithProfile = {
        ...doctor,
        user: doctor.user.profile,
      };
      return { message: 'Doctor Profile', data: doctorWithProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching doctor profile');
    }
  }

  async getDoctorDetails(doctorId: number) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { user_id: doctorId },
        relations: ['user'],
      });
      if (!doctor) throw new NotFoundException('No doctor found');
      const doctorWithProfile = {
        ...doctor,
        user: doctor.user.profile,
      };
      return { message: 'Doctor Details', data: doctorWithProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching doctor details');
    }
  }

  async searchDoctors(query?: string) {
    try {
      let where:
        | FindOptionsWhere<Doctor>
        | FindOptionsWhere<Doctor>[]
        | undefined = undefined;
      if (query) {
        where = [
          { clinic_name: ILike(`%${query}%`) },
          { specialization: ILike(`%${query}%`) },
          { user: { first_name: ILike(`%${query}%`) } },
          { user: { last_name: ILike(`%${query}%`) } },
        ];
      }
      const doctors = await this.doctorRepo.find({
        where,
        relations: ['user'],
      });
      const doctorWithProfile = doctors.map((doctor) => ({
        ...doctor,
        user: doctor.user.profile,
      }));
      return { total_results: doctors.length, data: doctorWithProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error searching doctors');
    }
  }

  async createAvailability(doctorId: number, dto: CreateDoctorAvailabilityDto) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { user_id: doctorId },
        relations: ['user'],
      });
      if (!doctor) throw new NotFoundException('Doctor not found');

      if (
        doctor.schedule_type === ScheduleType.WAVE &&
        (!dto.patients_per_slot || dto.patients_per_slot < 1)
      ) {
        throw new BadRequestException(
          'patients_per_slot must be provided for WAVE scheduling.',
        );
      }

      if (new Date(dto.date) < new Date(new Date().toDateString())) {
        throw new BadRequestException('Date is in the past');
      }

      const existing = await this.availabilityRepo.findOne({
        where: {
          doctor: { user_id: doctorId },
          date: dto.date,
          session: dto.session,
          start_time: dto.start_time,
          end_time: dto.end_time,
        },
      });
      if (existing) throw new BadRequestException('Duplicate availability');

      const availability = this.availabilityRepo.create({ ...dto, doctor });
      await this.availabilityRepo.save(availability);

      const slotTimes = this.generateSlots(
        dto.start_time,
        dto.end_time,
        dto.slot_duration,
      );
      const slots = slotTimes.map(({ start, end }) => {
        const timeSlot = this.timeSlotRepo.create({
          date: dto.date,
          session: dto.session,
          start_time: start,
          end_time: end,
          status: TimeSlotStatus.AVAILABLE,
          doctor,
          availability,
        });

        if (doctor.schedule_type === ScheduleType.WAVE) {
          timeSlot.max_patients = dto.patients_per_slot || 3; // Default for WAVE schedule
        } else {
          timeSlot.max_patients = 1; // Default for STREAM schedule
        }
        return timeSlot;
      });

      await this.timeSlotRepo.save(slots);

      return {
        message: 'Availability and slots created',
        data: {
          ...availability,
          doctor: { ...doctor, user: doctor.user.profile },
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating availability');
    }
  }

  async getAvailableTimeSlots(doctorId: number, page: number, limit: number) {
    try {
      const [slots, count] = await this.timeSlotRepo.findAndCount({
        where: {
          doctor: { user_id: doctorId },
          status: TimeSlotStatus.AVAILABLE,
        },
        order: { date: 'ASC', session: 'ASC', start_time: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['availability'],
      });

      if (!slots.length) {
        return {
          total: 0,
          page,
          limit,
          slots: [],
        };
      }

      return {
        total: count,
        page,
        limit,
        slots: slots.map((s) => ({
          timeslot_id: s.timeslot_id,
          date: s.date,
          session: s.session,
          start_time: s.start_time.slice(0, 5),
          end_time: s.end_time.slice(0, 5),
          max_patients: s.max_patients,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching time slots');
    }
  }

  async updateScheduleType(
    doctorId: number,
    scheduleType: ScheduleType,
  ): Promise<{ message: string }> {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { user_id: doctorId },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      doctor.schedule_type = scheduleType;
      await this.doctorRepo.save(doctor);

      return { message: `Doctor schedule type updated to ${scheduleType}` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating schedule type');
    }
  }

  private generateSlots(
    startTime: string,
    endTime: string,
    interval: number,
  ): { start: string; end: string }[] {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const toStr = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    };

    const startMins = toMin(startTime);
    const endMins = toMin(endTime);

    if (endMins <= startMins) {
      throw new BadRequestException('End time must be after start time');
    }

    const slots: { start: string; end: string }[] = [];
    let current = startMins;

    while (current + interval <= endMins) {
      slots.push({
        start: toStr(current),
        end: toStr(current + interval),
      });
      current += interval;
    }

    return slots;
  }
}
