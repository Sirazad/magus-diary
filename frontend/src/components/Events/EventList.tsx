import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarEvent, CalendarDateDTO } from '../../types/Calendar';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorAlert } from '../Common/ErrorAlert';
import './EventList.css';

interface EventListProps {
  calendarTypeCode: string;
  year: number;
  day: number;
  onEdit: (eventId: number, eventType: 'holiday' | 'participant' | 'party') => void;
  onEventChange?: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  calendarTypeCode,
  year,
  day,
  onEdit,
  onEventChange,
}) => {
  const queryClient = useQueryClient();

  const { data: calendarDate, isLoading } = useQuery({
    queryKey: ['events', calendarTypeCode, year, day],
    queryFn: async () => {
      const response = await apiClient.get<CalendarDateDTO>(
        `/calendar/${calendarTypeCode}/${year}/${day}`
      );
      return response.data;
    },
  });

  // Combine all events from the three arrays
  const events: CalendarEvent[] = calendarDate 
    ? [...calendarDate.holidays, ...calendarDate.participantNotableDates, ...calendarDate.partyNotableDates]
    : [];

  const deleteMutation = useMutation({
    mutationFn: async ({ eventId, eventType }: { eventId: number; eventType: string }) => {
      if (eventType === 'holiday') {
        return apiClient.delete(`/calendar/events/${eventId}`);
      } else if (eventType === 'participant') {
        return apiClient.delete(`/participants/notable-dates/${eventId}`);
      } else if (eventType === 'party') {
        return apiClient.delete(`/parties/notable-dates/${eventId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onEventChange?.(); // Notify parent that events changed
    },
  });

  if (isLoading) return <LoadingSpinner size="small" message="Események betöltése..." />;
  if (!events || events.length === 0) {
    return (
      <ErrorAlert 
        type="info" 
        title="Nincs esemény"
        message="Ezen a napon nincs esemény"
      />
    );
  }

  return (
    <div className="event-list-container">
      <h3 className="list-title">Events for Day {day}</h3>
      <div className="event-list">
        {events.map((event: CalendarEvent) => (
          <div key={event.id} className={`event-item event-${event.type}`}>
            <div className="event-header">
              <div className="event-title-section">
                <span className="event-type-badge">{event.type}</span>
                <h4 className="event-title">{event.eventName}</h4>
              </div>
              <div className="event-actions">
                <button
                  onClick={() => onEdit(parseInt(event.id), event.type as any)}
                  className="btn-icon btn-edit"
                  title="Edit event"
                >
                  ✏️
                </button>
                <button
                  onClick={() =>
                    deleteMutation.mutate({ eventId: parseInt(event.id), eventType: event.type })
                  }
                  disabled={deleteMutation.isPending}
                  className="btn-icon btn-delete"
                  title="Delete event"
                >
                  🗑️
                </button>
              </div>
            </div>

            {event.description && (
              <p className="event-description">{event.description}</p>
            )}

            <div className="event-meta">
              <span className="meta-item">
                Days: {event.dayStart}
                {event.dayEnd && ` - ${event.dayEnd}`}
              </span>
              {event.isRecurring && <span className="meta-item recurring">🔄 Recurring</span>}
              {event.relatedEntity && (
                <span className="meta-item">Related: {event.relatedEntity}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;