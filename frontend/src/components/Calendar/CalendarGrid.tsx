import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarDateDTO } from '../../types/Calendar';
import './CalendarGrid.css';

interface CalendarGridProps {
  calendarTypeCode: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarTypeCode }) => {
  const [year, setYear] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Fetch calendar data for the selected year
  const { data: calendarDates, isLoading, error } = useQuery({
    queryKey: ['calendar', calendarTypeCode, year],
    queryFn: async () => {
      const response = await apiClient.get<CalendarDateDTO[]>(
        `/calendar/${calendarTypeCode}/${year}`
      );
      return response.data;
    },
  });

  if (isLoading) return <div className="calendar-loading">Loading calendar...</div>;
  if (error) return <div className="calendar-error">Error loading calendar</div>;
  if (!calendarDates) return <div className="calendar-empty">No calendar data</div>;

  // Group dates by month
  const datesByMonth = calendarDates.reduce((acc, date) => {
    if (!acc[date.monthNumber]) {
      acc[date.monthNumber] = [];
    }
    acc[date.monthNumber].push(date);
    return acc;
  }, {} as Record<number, CalendarDateDTO[]>);

  const handlePreviousYear = () => {
    if (year > 1) setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  const handleDateClick = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  return (
    <div className="calendar-grid-container">
      <div className="calendar-header">
        <button onClick={handlePreviousYear} className="calendar-nav-btn">
          ← Previous Year
        </button>
        <h2 className="calendar-title">
          {calendarTypeCode.toUpperCase()} - Year {year}
        </h2>
        <button onClick={handleNextYear} className="calendar-nav-btn">
          Next Year →
        </button>
      </div>

      <div className="calendar-months">
        {Object.entries(datesByMonth).map(([monthNum, dates]) => (
          <div key={monthNum} className="calendar-month">
            <h3 className="month-title">
              {dates[0]?.monthName} (Days {dates[0]?.day}-{dates[dates.length - 1]?.day})
            </h3>
            <div className="month-grid">
              {dates.map((date) => (
                <div
                  key={`${date.day}`}
                  className={`calendar-date ${
                    date.holidays.length > 0 ? 'has-holiday' : ''
                  } ${date.participantNotableDates.length > 0 ? 'has-participant' : ''} ${
                    date.partyNotableDates.length > 0 ? 'has-party' : ''
                  } ${selectedDay === date.day ? 'selected' : ''}`}
                  onClick={() => handleDateClick(date.day)}
                >
                  <div className="date-number">{date.day}</div>
                  <div className="date-info">
                    <div className="date-season">{date.season}</div>
                    {date.godName && <div className="date-god">{date.godName}</div>}
                  </div>
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
            {selectedDay && dates.some((d) => d.day === selectedDay) && (
              <div className="month-events">
                {dates
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
                {dates
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
                {dates
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
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;