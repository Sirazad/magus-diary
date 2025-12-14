import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarDateDTO, MonthConfigDTO, CalendarEvent } from '../../types/Calendar';
import { EventManager } from '../Events/EventManager';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorAlert } from '../Common/ErrorAlert';
import './CalendarGrid.css';

interface CalendarGridProps {
  calendarTypeCode: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarTypeCode }) => {
  const [year, setYear] = useState(3698);
  const [currentDay, setCurrentDay] = useState(161); // Default to day 161 (month 9, day 1)
  const [currentMonthNumber, setCurrentMonthNumber] = useState(9); // Month 9 contains day 161
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Event type filters
  const [showHolidays, setShowHolidays] = useState(true);
  const [showParticipantEvents, setShowParticipantEvents] = useState(true);
  const [showPartyEvents, setShowPartyEvents] = useState(true);
  
  // Entity filters (participant/party IDs or names)
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [selectedParties, setSelectedParties] = useState<Set<string>>(new Set());
  
  const queryClient = useQueryClient();

  // Fetch only the current month configuration
  const { data: currentMonthConfig } = useQuery({
    queryKey: ['calendar-month-config', calendarTypeCode, currentMonthNumber],
    queryFn: async () => {
      const response = await apiClient.get<MonthConfigDTO>(
        `/calendar/config/${calendarTypeCode}/${currentMonthNumber}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch total months for navigation (lazy loaded)
  const { data: totalMonths } = useQuery({
    queryKey: ['calendar-total-months', calendarTypeCode],
    queryFn: async () => {
      const response = await apiClient.get<number>(
        `/calendar/types/${calendarTypeCode}/months`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch all events for the current month
  const { data: monthEvents } = useQuery({
    queryKey: ['calendar-month-events', calendarTypeCode, year, currentMonthConfig?.monthNumber],
    queryFn: async () => {
      if (!currentMonthConfig) return [];
      
      // Fetch calendar dates for all days in the month range in parallel
      const allEvents: CalendarEvent[] = [];
      const seenEventIds = new Set<string>();
      
      // Create all requests at once
      const dayRequests = [];
      for (let day = currentMonthConfig.dayStart; day <= currentMonthConfig.dayEnd; day++) {
        dayRequests.push(
          apiClient.get<CalendarDateDTO>(
            `/calendar/${calendarTypeCode}/${year}/${day}`
          ).catch(() => null) // Handle errors gracefully
        );
      }
      
      // Execute all requests in parallel
      const responses = await Promise.all(dayRequests);
      
      // Collect events from all responses, preserving their correct type
      responses.forEach(response => {
        if (response?.data) {
          const dateData = response.data;
          
          // Add events from each array with the correct type
          dateData.holidays.forEach(event => {
            if (!seenEventIds.has(event.id)) {
              seenEventIds.add(event.id);
              allEvents.push({ ...event, type: 'holiday' as const });
            }
          });
          
          dateData.participantNotableDates.forEach(event => {
            if (!seenEventIds.has(event.id)) {
              seenEventIds.add(event.id);
              allEvents.push({ ...event, type: 'participant' as const });
            }
          });
          
          dateData.partyNotableDates.forEach(event => {
            if (!seenEventIds.has(event.id)) {
              seenEventIds.add(event.id);
              allEvents.push({ ...event, type: 'party' as const });
            }
          });
        }
      });
      
      console.log('Fetched events for month:', allEvents.length, 'events');
      return allEvents;
    },
    enabled: !!currentMonthConfig,
    staleTime: 0, // Allow refetch when invalidated
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isLoading = !currentMonthConfig;
  const error = false;
  const monthConfig = currentMonthConfig;

  // Helper function to check if an event is active on a specific day and year
  const isEventActiveOnDay = (event: CalendarEvent, day: number, currentYear: number): boolean => {
    // Check if day is in range
    const dayInRange = day >= event.dayStart && (event.dayEnd === null || day <= event.dayEnd);
    if (!dayInRange) {
      return false;
    }

    // If no year constraints, check if it's recurring or just show it
    if (event.yearStart === null && event.yearEnd === null) {
      // For events without year constraints, show them if they're recurring
      // OR if no year info is specified at all (default behavior for holidays)
      return true; // Changed: show all events without year constraints on their days
    }

    // Check year range
    const yearStart = event.yearStart || -Infinity;
    const yearEnd = event.yearEnd || Infinity;
    const inYearRange = currentYear >= yearStart && currentYear <= yearEnd;
    
    return inYearRange;
  };

  // Get events for a specific day
  const getEventsForDay = (day: number): { holidays: CalendarEvent[], participantEvents: CalendarEvent[], partyEvents: CalendarEvent[] } => {
    if (!monthEvents) return { holidays: [], participantEvents: [], partyEvents: [] };

    const holidays: CalendarEvent[] = [];
    const participantEvents: CalendarEvent[] = [];
    const partyEvents: CalendarEvent[] = [];

    monthEvents.forEach(event => {
      if (!isEventActiveOnDay(event, day, year)) return;
      
      // Apply filters
      if (event.type === 'holiday' && showHolidays) {
        holidays.push(event);
      } else if (event.type === 'participant' && showParticipantEvents) {
        // Filter by selected participants (if any selected, only show those)
        if (selectedParticipants.size === 0 || (event.relatedEntity && selectedParticipants.has(event.relatedEntity))) {
          participantEvents.push(event);
        }
      } else if (event.type === 'party' && showPartyEvents) {
        // Filter by selected parties (if any selected, only show those)
        if (selectedParties.size === 0 || (event.relatedEntity && selectedParties.has(event.relatedEntity))) {
          partyEvents.push(event);
        }
      }
    });

    return { holidays, participantEvents, partyEvents };
  };
  
  // Get unique participants and parties from events for filter options
  const getUniqueEntities = (): { participants: string[], parties: string[] } => {
    if (!monthEvents) return { participants: [], parties: [] };
    
    const participants = new Set<string>();
    const parties = new Set<string>();
    
    monthEvents.forEach(event => {
      if (event.relatedEntity) {
        if (event.type === 'participant') {
          participants.add(event.relatedEntity);
        } else if (event.type === 'party') {
          parties.add(event.relatedEntity);
        }
      }
    });
    
    return {
      participants: Array.from(participants).sort(),
      parties: Array.from(parties).sort()
    };
  };
  
  const uniqueEntities = getUniqueEntities();
  
  const toggleParticipantFilter = (participant: string) => {
    setSelectedParticipants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(participant)) {
        newSet.delete(participant);
      } else {
        newSet.add(participant);
      }
      return newSet;
    });
  };
  
  const togglePartyFilter = (party: string) => {
    setSelectedParties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(party)) {
        newSet.delete(party);
      } else {
        newSet.add(party);
      }
      return newSet;
    });
  };

  if (isLoading) return <LoadingSpinner message="Naptár betöltése..." />;
  if (error) return (
    <ErrorAlert 
      message="Nem sikerült betölteni a naptárt" 
      details={(error as Error)?.message}
    />
  );
  if (!monthConfig) return (
    <ErrorAlert 
      type="info"
      title="Nincs adat"
      message="Nincs elérhető naptár adat ehhez az időszakhoz"
    />
  );

  // Generate calendar dates from month config
  const calendarDates: CalendarDateDTO[] = [];
  let dayInMonth = 1;
  for (let day = monthConfig.dayStart; day <= monthConfig.dayEnd; day++) {
    const dayEvents = getEventsForDay(day);
    
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
      holidays: dayEvents.holidays,
      participantNotableDates: dayEvents.participantEvents,
      partyNotableDates: dayEvents.partyEvents,
    });
    dayInMonth++;
  }

  const handlePreviousMonth = () => {
    if (!currentMonthConfig || !totalMonths) return;
    
    if (currentMonthNumber > 1) {
      // Go to previous month
      setCurrentMonthNumber(currentMonthNumber - 1);
    } else {
      // Wrap to previous year, last month
      setYear(year - 1);
      setCurrentMonthNumber(totalMonths);
    }
  };

  const handleNextMonth = () => {
    if (!currentMonthConfig || !totalMonths) return;
    
    if (currentMonthNumber < totalMonths) {
      // Go to next month
      setCurrentMonthNumber(currentMonthNumber + 1);
    } else {
      // Wrap to next year, first month
      setYear(year + 1);
      setCurrentMonthNumber(1);
    }
  };

  const handlePreviousDay = () => {
    if (!currentMonthConfig || !totalMonths) return;
    
    if (currentDay > currentMonthConfig.dayStart) {
      setCurrentDay(currentDay - 1);
    } else if (currentMonthNumber > 1) {
      // Go to previous month, last day - need to fetch previous month config
      setCurrentMonthNumber(currentMonthNumber - 1);
    } else {
      // Wrap to previous year, last month
      setYear(year - 1);
      setCurrentMonthNumber(totalMonths);
    }
  };

  const handleNextDay = () => {
    if (!currentMonthConfig || !totalMonths) return;
    
    if (currentDay < currentMonthConfig.dayEnd) {
      setCurrentDay(currentDay + 1);
    } else if (currentMonthNumber < totalMonths) {
      // Go to next month, first day
      setCurrentMonthNumber(currentMonthNumber + 1);
      // currentDay will be updated when new month config loads
    } else {
      // Wrap to next year, first month
      setYear(year + 1);
      setCurrentMonthNumber(1);
    }
  };

  const handleDateClick = (day: number) => {
    if (selectedDay === day) {
      // Clicking same day toggles panel off
      setSelectedDay(null);
      setShowEventPanel(false);
    } else {
      // Clicking new day shows panel
      setSelectedDay(day);
      setShowEventPanel(true);
    }
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

  const handleRefreshEvents = () => {
    queryClient.refetchQueries({ queryKey: ['calendar-month-events'] });
  };

  return (
    <div className={`calendar-with-events ${showEventPanel ? 'panel-open' : ''}`}>
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
        <div className="header-center">
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
          <div className="header-actions">
            <button 
              onClick={() => setShowFilterPanel(!showFilterPanel)} 
              className="calendar-nav-btn calendar-filter-btn"
              title="Szűrők"
            >
              🔍 Szűrők
            </button>
            <button 
              onClick={handleRefreshEvents} 
              className="calendar-nav-btn calendar-filter-btn"
              title="Események frissítése"
            >
              🔄 Frissítés
            </button>
          </div>
        </div>
        <div className="nav-group">
          <button onClick={handleNextDay} className="calendar-nav-btn calendar-nav-btn-day">
            nap →
          </button>
          <button onClick={handleNextMonth} className="calendar-nav-btn">
            következő hónap →
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="filter-panel">
          <h3>Esemény szűrők</h3>
          
          <div className="filter-section">
            <h4>Esemény típusok</h4>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={showHolidays}
                onChange={(e) => setShowHolidays(e.target.checked)}
              />
              <span>🗓️ Ünnepnapok</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={showParticipantEvents}
                onChange={(e) => setShowParticipantEvents(e.target.checked)}
              />
              <span>👤 Karakter események</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={showPartyEvents}
                onChange={(e) => setShowPartyEvents(e.target.checked)}
              />
              <span>👥 Csapat események</span>
            </label>
          </div>

          {showParticipantEvents && uniqueEntities.participants.length > 0 && (
            <div className="filter-section">
              <h4>Karakterek</h4>
              <div className="filter-hint">
                {selectedParticipants.size === 0 ? 'Mind megjelenítve' : `${selectedParticipants.size} kiválasztva`}
              </div>
              {uniqueEntities.participants.map(participant => (
                <label key={participant} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedParticipants.has(participant)}
                    onChange={() => toggleParticipantFilter(participant)}
                  />
                  <span>{participant}</span>
                </label>
              ))}
            </div>
          )}

          {showPartyEvents && uniqueEntities.parties.length > 0 && (
            <div className="filter-section">
              <h4>Csapatok</h4>
              <div className="filter-hint">
                {selectedParties.size === 0 ? 'Mind megjelenítve' : `${selectedParties.size} kiválasztva`}
              </div>
              {uniqueEntities.parties.map(party => (
                <label key={party} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedParties.has(party)}
                    onChange={() => togglePartyFilter(party)}
                  />
                  <span>{party}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

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
                  
                  {/* Display event names on the calendar day */}
                  <div className="event-names">
                    {date.holidays.map((event) => (
                      <div key={event.id} className="event-name holiday-name">
                        {event.eventName}
                      </div>
                    ))}
                    {date.participantNotableDates.map((event) => (
                      <div key={event.id} className="event-name participant-name">
                        {event.eventName}
                      </div>
                    ))}
                    {date.partyNotableDates.map((event) => (
                      <div key={event.id} className="event-name party-name">
                        {event.eventName}
                      </div>
                    ))}
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
    
    {/* Event Panel */}
    {showEventPanel && selectedDay && (
      <div className="event-panel">
        <div className="event-panel-header">
          <button 
            onClick={() => setShowEventPanel(false)}
            className="btn-toggle-panel"
            title="Esemény panel bezárása"
          >
            ✕
          </button>
        </div>
        <EventManager
          calendarTypeCode={calendarTypeCode}
          year={year}
          day={selectedDay}
          onClose={() => {
            setShowEventPanel(false);
            setSelectedDay(null);
          }}
          onEventChange={() => {
            // Refresh events when an event is created/modified/deleted
            queryClient.refetchQueries({ queryKey: ['calendar-month-events'] });
          }}
        />
      </div>
    )}
    </div>
  );
};

export default CalendarGrid;