import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarType } from '../../types/Calendar';
import './CalendarTypeSelector.css';

interface CalendarTypeSelectorProps {
  selectedCalendarCode: string;
  onCalendarChange: (code: string) => void;
}

export const CalendarTypeSelector: React.FC<CalendarTypeSelectorProps> = ({
  selectedCalendarCode,
  onCalendarChange,
}) => {
  const { data: calendarTypes, isLoading, error } = useQuery({
    queryKey: ['calendarTypes'],
    queryFn: async () => {
      const response = await apiClient.get<CalendarType[]>('/calendar/types');
      return response.data;
    },
  });

  if (isLoading) return <div className="selector-loading">Loading calendars...</div>;
  if (error) return <div className="selector-error">Error loading calendars</div>;
  if (!calendarTypes || calendarTypes.length === 0) {
    return <div className="selector-empty">No calendars available</div>;
  }

  return (
    <div className="calendar-type-selector">
      <label htmlFor="calendar-select" className="selector-label">
        Naptár választása:
      </label>
      <select
        id="calendar-select"
        value={selectedCalendarCode}
        onChange={(e) => onCalendarChange(e.target.value)}
        className="selector-dropdown"
      >
        {calendarTypes.map((calendar) => (
          <option key={calendar.code} value={calendar.code}>
            {calendar.name} ({calendar.daysPerYear} days)
          </option>
        ))}
      </select>
    </div>
  );
};

export default CalendarTypeSelector;