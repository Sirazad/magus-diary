import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarDateDTO, MonthConfigDTO } from '../../types/Calendar';
import './CalendarGrid.css';

interface CalendarGridProps {
  calendarTypeCode: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarTypeCode }) => {
  const [year, setYear] = useState(3698);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEditingYear, setIsEditingYear] = useState(false);

  // Fetch month configuration for the current month
  const { data: monthConfig, isLoading, error } = useQuery({
    queryKey: ['calendar', calendarTypeCode, currentMonth],
    queryFn: async () => {
      const response = await apiClient.get<MonthConfigDTO>(
        `/calendar/config/${calendarTypeCode}/${currentMonth}`
      );
      return response.data;
    },
  });

  if (isLoading) return <div className="calendar-loading">Loading calendar...</div>;
  if (error) return <div className="calendar-error">Error loading calendar</div>;
  if (!monthConfig) return <div className="calendar-empty">No calendar data</div>;

  // Generate calendar dates from month config
  const calendarDates: CalendarDateDTO[] = [];
  let dayInMonth = 1;
  for (let day = monthConfig.dayStart; day <= monthConfig.dayEnd; day++) {
    calendarDates.push({
      calendarTypeCode: monthConfig.calendarTypeCode,
      year: year,
      day: day, // Global day number
      dayInMonth: dayInMonth, // Day within month
      dayOfWeek: ((day - 1) % 5) + 1, // 5-day weeks
      monthName: monthConfig.monthName,
      monthNumber: monthConfig.monthNumber,
      season: monthConfig.season,
      godName: monthConfig.god,
      holidays: [],
      participantNotableDates: [],
      partyNotableDates: [],
    });
    dayInMonth++;
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth + 1);
  };

  const handleDateClick = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    if (!isNaN(newYear) && newYear > 0) {
      setYear(newYear);
    }
  };

  const handleYearBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    if (isNaN(newYear) || newYear < 1) {
      setYear(1);
    }
    setIsEditingYear(false);
  };

  const handleYearClick = () => {
    setIsEditingYear(true);
  };

  return (
    <div className="calendar-grid-container">
      <div className="calendar-header">
        <button onClick={handlePreviousMonth} className="calendar-nav-btn" disabled={currentMonth === 1}>
          ← Previous Month
        </button>
        <h2 className="calendar-title">
          {calendarDates[0]?.monthName || calendarTypeCode.toUpperCase()} - 
          {isEditingYear ? (
            <input 
              type="number" 
              value={year} 
              onChange={handleYearChange}
              onBlur={handleYearBlur}
              min="1"
              className="year-input editing"
              autoFocus
            />
          ) : (
            <span className="year-display" onClick={handleYearClick}>
              {year}
            </span>
          )}
        </h2>
        <button onClick={handleNextMonth} className="calendar-nav-btn">
          Next Month →
        </button>
      </div>

      <div className="calendar-months">
        <div key={currentMonth} className="calendar-month">
          <h3 className="month-title">
            {calendarDates[0]?.monthName} - {calendarDates[0]?.season}{calendarDates[0]?.godName ? ` - ${calendarDates[0].godName}` : ''}
          </h3>
          <div className="month-grid">
            {calendarDates.map((date) => (
                <div
                  key={`${date.day}`}
                  className={`calendar-date ${
                    date.holidays.length > 0 ? 'has-holiday' : ''
                  } ${date.participantNotableDates.length > 0 ? 'has-participant' : ''} ${
                    date.partyNotableDates.length > 0 ? 'has-party' : ''
                  } ${selectedDay === date.day ? 'selected' : ''}`}
                  onClick={() => handleDateClick(date.day)}
                >
                  <div className="date-number">{date.dayInMonth}</div>
                  {(date.holidays.length > 0 ||
                    date.participantNotableDates.length > 0 ||
                    date.partyNotableDates.length > 0) && (
                    <div className="event-indicator">
                      {date.holidays.length > 0 && <span className="indicator holiday">🗓️</span>}
                      {date.participantNotableDates.length > 0 && (
                        <span className="indicator participant">👤</span>
                      )}
                      {date.partyNotableDates.length > 0 && (
                        <span className="indicator party">👥</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show events for selected day in this month */}
            {selectedDay && calendarDates.some((d) => d.day === selectedDay) && (
              <div className="month-events">
                {calendarDates
                  .find((d) => d.day === selectedDay)
                  ?.holidays.map((event) => (
                    <div key={event.id} className="event holiday-event">
                      <span className="event-type">🗓️ Holiday</span>
                      <span className="event-name">{event.eventName}</span>
                      {event.description && (
                        <span className="event-description">{event.description}</span>
                      )}
                    </div>
                  ))}
                {calendarDates
                  .find((d) => d.day === selectedDay)
                  ?.participantNotableDates.map((event) => (
                    <div key={event.id} className="event participant-event">
                      <span className="event-type">👤 {event.relatedEntity}</span>
                      <span className="event-name">{event.eventName}</span>
                      {event.description && (
                        <span className="event-description">{event.description}</span>
                      )}
                    </div>
                  ))}
                {calendarDates
                  .find((d) => d.day === selectedDay)
                  ?.partyNotableDates.map((event) => (
                    <div key={event.id} className="event party-event">
                      <span className="event-type">👥 {event.relatedEntity}</span>
                      <span className="event-name">{event.eventName}</span>
                      {event.description && (
                        <span className="event-description">{event.description}</span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default CalendarGrid;