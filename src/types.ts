import { Dayjs } from "dayjs";

export interface Shift {
  title: string;
  start: Dayjs;
  end: Dayjs;
}

export interface Rule {
  id: number;
  match: string;
  startTime: Dayjs;
  endTime: Dayjs;
  endsNextDay: boolean;
  noEvent: boolean;
  title: string;
}

export interface Calendar {
  id: string;
  backgroundColor: string;
  summary: string;
}

export interface Event {
  id: string;
  recurrence?: string;
}

export interface TimeSpec {
  datetime: string;
}

export interface NewEvent {
  start: TimeSpec;
  end: TimeSpec;
  summary: string;
}
