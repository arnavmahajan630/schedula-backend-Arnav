import {
  BadRequestException,
  Injectable,
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
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(DoctorTimeSlot)
    private timeSlotRepo: Repository<DoctorTimeSlot>,
  ) {}

  async getProfile(doctorId: number) {
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
  }

  async getDoctorDetails(doctorId: number) {
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
  }

  async searchDoctors(query?: string) {
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
    const doctors = await this.doctorRepo.find({ where, relations: ['user'] });
    const doctorWithProfile = doctors.map((doctor) => ({
      ...doctor,
      user: doctor.user.profile,
    }));
    return { total_results: doctors.length, data: doctorWithProfile };
  }

  async createAvailability(doctorId: number, dto: CreateDoctorAvailabilityDto) {
    const doctor = await this.doctorRepo.findOne({
      where: { user_id: doctorId },
      relations: ['user'],
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    if (new Date(dto.date) < new Date(new Date().toDateString())) {
      throw new BadRequestException('Date is in the past');
    }

    const existing = await this.availabilityRepo.findOne({
      where: {
        doctor: { user_id: doctorId },
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
    if (existing) throw new BadRequestException('Duplicate availability');

    const availability = this.availabilityRepo.create({ ...dto, doctor });
    await this.availabilityRepo.save(availability);

    const slots = this.generateSlots(dto.startTime, dto.endTime, 30).map(
      ({ start, end }) =>
        this.timeSlotRepo.create({
          date: dto.date,
          startTime: start,
          endTime: end,
          status: TimeSlotStatus.AVAILABLE,
          doctor,
          availability,
        }),
    );
    await this.timeSlotRepo.save(slots);

    return {
      message: 'Availability and slots created',
      data: { ...availability, doctor: doctor.user.profile },
    };
  }

  async getAvailableTimeSlots(doctorId: number, page: number, limit: number) {
    const [slots, count] = await this.timeSlotRepo.findAndCount({
      where: {
        doctor: { user_id: doctorId },
        status: TimeSlotStatus.AVAILABLE,
      },
      order: { date: 'ASC', startTime: 'ASC' },
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

    const { date, session, weekdays } = slots[0].availability;

    return {
      total: count,
      page,
      limit,
      date,
      session,
      weekdays,
      slots: slots.map((s) => ({
        date: s.date,
        startTime: s.startTime.slice(0, 5),
        endTime: s.endTime.slice(0, 5),
      })),
    };
  }

  async updateScheduleType(
    doctorId: number,
    scheduleType: ScheduleType,
  ): Promise<{ message: string }> {
    const doctor = await this.doctorRepo.findOne({
      where: { user_id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.schedule_type = scheduleType;
    await this.doctorRepo.save(doctor);

    return { message: `Doctor schedule type updated to ${scheduleType}` };
  }

  private generateSlots(
    startTime: string,
    endTime: string,
    interval: number = 30, // default 30-minute slots
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
