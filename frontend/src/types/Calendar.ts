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