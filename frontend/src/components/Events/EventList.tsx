import React from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { CalendarEvent, CalendarDateDTO } from '../../types/Calendar';
import { ErrorAlert } from '../Common/ErrorAlert';
import './EventList.css';

interface EventListProps {
  calendarTypeCode: string;
  year: number;
  day: number;
  monthNumber: number;
  activeParticipantId: number | null;
  onEdit: (eventId: number, eventType: 'holiday' | 'participant' | 'party') => void;
  onEventChange?: () => void;
  events?: CalendarEvent[];
}

export const EventList: React.FC<EventListProps> = ({
  calendarTypeCode,
  year,
  day,
  monthNumber,
  activeParticipantId,
  onEdit,
  onEventChange,
  events = [],
}) => {
  const deleteMutation = useMutation({
    mutationFn: async ({ eventId, eventType }: { eventId: number; eventType: string }) => {
      if (eventType === 'holiday') {
        return apiClient.delete(`/participant-notable-dates/${eventId}`);
      } else if (eventType === 'participant') {
        return apiClient.delete(`/participant-notable-dates/${eventId}`);
      } else if (eventType === 'party') {
        return apiClient.delete(`/party-notable-dates/${eventId}`);
      }
    },
    onSuccess: () => {
      // Let the parent handle invalidation via onEventChange callback
      onEventChange?.();
    },
  });

  // Helper to extract numeric ID from prefixed ID (e.g., "party-3" -> 3)
  const getNumericId = (prefixedId: string): number => {
    const parts = prefixedId.split('-');
    return parseInt(parts[parts.length - 1]);
  };

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
                  onClick={() => onEdit(getNumericId(event.id), event.type as any)}
                  className="btn-icon btn-edit"
                  title="Edit event"
                >
                  ✏️
                </button>
                <button
                  onClick={() =>
                    deleteMutation.mutate({ eventId: getNumericId(event.id), eventType: event.type })
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