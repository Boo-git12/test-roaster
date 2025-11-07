export interface Personnel {
  id: string;
  name: string;
}

export interface Shift {
  id: string;
  name: string;
}

export interface ScheduledShift {
  shiftName: string;
  personnel: string[];
}

export interface ScheduleDay {
  date: string;
  shifts: ScheduledShift[];
}
