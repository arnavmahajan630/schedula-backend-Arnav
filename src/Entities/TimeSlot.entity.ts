interface TimeSlot {
  id: UUID;
  doctorId: UUID;
  date: string; // ISO date (e.g. "2025-06-17")
  startTime: string; // e.g. "14:00"
  endTime: string;   // e.g. "14:30"
  isBooked: boolean;
}
