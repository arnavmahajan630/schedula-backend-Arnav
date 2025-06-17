interface Appointment {
  id: UUID;
  patientId: UUID;
  doctorId: UUID;
  timeSlotId: UUID;
  reason: string;
  status: AppointmentStatus;
}
