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
  const [currentDay, setCurrentDay] = useState(161); // Default to day 161 (month 9, day 1)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEditingYear, setIsEditingYear] = useState(false);

  // Fetch all month configurations to find which month contains currentDay
  const { data: allMonthConfigs } = useQuery({
    queryKey: ['calendar-all-months', calendarTypeCode],
    queryFn: async () => {
      const response = await apiClient.get<number>(
        `/calendar/types/${calendarTypeCode}/months`
      );
      const totalMonths = response.data;
      
      // Fetch all month configs
      const monthPromises = [];
      for (let i = 1; i <= totalMonths; i++) {
        monthPromises.push(
          apiClient.get<MonthConfigDTO>(
            `/calendar/config/${calendarTypeCode}/${i}`
          ).then(res => res.data)
        );
      }
      return Promise.all(monthPromises);
    },
  });

  // Find the month that contains the current day
  const currentMonthConfig = allMonthConfigs?.find(
    config => currentDay >= config.dayStart && currentDay <= config.dayEnd
  );

  const isLoading = !allMonthConfigs;
  const error = false;
  const monthConfig = currentMonthConfig;

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
    if (!allMonthConfigs || !currentMonthConfig) return;
    
    const currentMonthIndex = allMonthConfigs.findIndex(
      config => config.monthNumber === currentMonthConfig.monthNumber
    );
    
    if (currentMonthIndex > 0) {
      // Go to first day of previous month
      const prevMonthConfig = allMonthConfigs[currentMonthIndex - 1];
      setCurrentDay(prevMonthConfig.dayStart);
    } else {
      // Wrap to previous year, last month
      setYear(year - 1);
      const lastMonthConfig = allMonthConfigs[allMonthConfigs.length - 1];
      setCurrentDay(lastMonthConfig.dayStart);
    }
  };

  const handleNextMonth = () => {
    if (!allMonthConfigs || !currentMonthConfig) return;
    
    const currentMonthIndex = allMonthConfigs.findIndex(
      config => config.monthNumber === currentMonthConfig.monthNumber
    );
    
    if (currentMonthIndex < allMonthConfigs.length - 1) {
      // Go to first day of next month
      const nextMonthConfig = allMonthConfigs[currentMonthIndex + 1];
      setCurrentDay(nextMonthConfig.dayStart);
    } else {
      // Wrap to next year, first month
      setYear(year + 1);
      const firstMonthConfig = allMonthConfigs[0];
      setCurrentDay(firstMonthConfig.dayStart);
    }
  };

  const handlePreviousDay = () => {
    if (!allMonthConfigs) return;
    
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    } else {
      // Wrap to previous year, last day
      setYear(year - 1);
      const lastMonthConfig = allMonthConfigs[allMonthConfigs.length - 1];
      setCurrentDay(lastMonthConfig.dayEnd);
    }
  };

  const handleNextDay = () => {
    if (!allMonthConfigs) return;
    
    const lastMonthConfig = allMonthConfigs[allMonthConfigs.length - 1];
    if (currentDay < lastMonthConfig.dayEnd) {
      setCurrentDay(currentDay + 1);
    } else {
      // Wrap to next year, first day
      setYear(year + 1);
      setCurrentDay(1);
    }
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
        <div className="nav-group">
          <button onClick={handlePreviousMonth} className="calendar-nav-btn">
            ← előző hónap
          </button>
          <button onClick={handlePreviousDay} className="calendar-nav-btn calendar-nav-btn-day">
            ← nap
          </button>
        </div>
        <h2 className="calendar-title">
          {calendarDates[0]?.monthName} {calendarDates.find(d => d.day === currentDay)?.dayInMonth || 1} - 
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
        <div className="nav-group">
          <button onClick={handleNextDay} className="calendar-nav-btn calendar-nav-btn-day">
            nap →
          </button>
          <button onClick={handleNextMonth} className="calendar-nav-btn">
            következő hónap →
          </button>
        </div>
      </div>

      <div className="calendar-months">
        <div key={currentDay} className="calendar-month">
          <div className="month-info">
            <span>
              {calendarDates[0]?.season}
              {calendarDates[0]?.godName && ` - ${calendarDates[0].godName}`}
              {` - ${calendarDates[0]?.monthName}`}
              {` - ${calendarDates.find(d => d.day === currentDay)?.dayInMonth || 1}`}
              <span className="day-in-year"> ({currentDay})</span>
            </span>
          </div>
          <div className="month-grid">
            {calendarDates.map((date) => (
                <div
                  key={`${date.day}`}
                  className={`calendar-date ${
                    date.holidays.length > 0 ? 'has-holiday' : ''
                  } ${date.participantNotableDates.length > 0 ? 'has-participant' : ''} ${
                    date.partyNotableDates.length > 0 ? 'has-party' : ''
                  } ${selectedDay === date.day ? 'selected' : ''} ${
                    date.day === currentDay ? 'active' : ''
                  }`}
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