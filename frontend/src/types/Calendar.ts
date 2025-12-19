export interface CalendarType {
  code: string;
  name: string;
  daysPerYear: number;
  daysPerWeek: number;
}

export interface CalendarDate {
  year: number;
  day: number;
  dayOfWeek: number;
  dayName: string;
  monthNumber: number;
  monthName: string;
  season: string;
  godName: string | null;
  week: number;
  holidays: CalendarEvent[];
  participantNotableDates: CalendarEvent[];
  partyNotableDates: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  eventName: string;
  description: string | null;
  type: 'holiday' | 'participant' | 'party';
  relatedEntity: string | null;
  dayStart: number;
  dayEnd: number | null;  
  isRecurring: boolean;   
  yearStart: number | null; 
  yearEnd: number | null;
}

export interface CalendarDateDTO {
  calendarTypeCode: string;
  year: number;
  day: number; // Global day number (1-620)
  dayInMonth?: number; // Day within the month (1-20, etc.)
  dayOfWeek: number;
  monthName: string;
  monthNumber: number;
  season: string;
  godName: string | null;
  holidays: CalendarEvent[];
  participantNotableDates: CalendarEvent[];
  partyNotableDates: CalendarEvent[];
}

export interface MonthConfigDTO {
  id: number;
  calendarTypeCode: string;
  calendarTypeCodeName: string;
  monthNumber: number;
  monthName: string;
  dayStart: number;
  dayEnd: number;
  season: string;
  god: string | null;
}
