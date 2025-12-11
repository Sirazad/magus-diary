import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import './EventForm.css';

interface EventFormProps {
  calendarTypeCode: string;
  year: number;
  day: number;
  onSuccess: () => void;
  onCancel: () => void;
  eventId?: number;
  eventType: 'holiday' | 'participant' | 'party';
}

interface FormData {
  eventName: string;
  description: string;
  day: number;
  dayEnd: number | null;
  year: number | null;
  isRecurring: boolean;
  yearStart: number | null;
  yearEnd: number | null;
  participantId?: number;
  partyId?: number;
}

export const EventForm: React.FC<EventFormProps> = ({
  calendarTypeCode,
  year,
  day,
  onSuccess,
  onCancel,
  eventId,
  eventType,
}) => {
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    description: '',
    day,
    dayEnd: null,
    year,
    isRecurring: false,
    yearStart: year,
    yearEnd: null,
    participantId: undefined,
    partyId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch participants if needed
  const { data: participants } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const response = await apiClient.get('/participants');
      return response.data;
    },
    enabled: eventType === 'participant',
  });

  // Fetch parties if needed
  const { data: parties } = useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const response = await apiClient.get('/parties');
      return response.data;
    },
    enabled: eventType === 'party',
  });

  // Fetch existing event if editing
  useEffect(() => {
    if (eventId && eventType === 'holiday') {
      // Fetch holiday event
      apiClient
        .get(`/calendar/events/${eventId}`)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
          }));
        })
        .catch((err) => console.error('Error fetching event:', err));
    }
  }, [eventId, eventType]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (eventType === 'holiday') {
        if (eventId) {
          return apiClient.put(`/calendar/events/${eventId}`, {
            ...data,
            calendarTypeCode,
          });
        } else {
          return apiClient.post('/calendar/events', {
            ...data,
            calendarTypeCode,
          });
        }
      } else if (eventType === 'participant') {
        if (eventId) {
          return apiClient.put(`/participant-notable-dates/${eventId}`, {
            ...data,
            calendarTypeCode,
          });
        } else {
          return apiClient.post('/participant-notable-dates', {
            ...data,
            calendarTypeCode,
          });
        }
      } else if (eventType === 'party') {
        if (eventId) {
          return apiClient.put(`/party-notable-dates/${eventId}`, {
            ...data,
            calendarTypeCode,
          });
        } else {
          return apiClient.post('/party-notable-dates', {
            ...data,
            calendarTypeCode,
          });
        }
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      setErrors({
        submit: error.response?.data?.message || 'Error saving event',
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (formData.day < 1) {
      newErrors.day = 'Day must be at least 1';
    }

    if (formData.dayEnd && formData.dayEnd < formData.day) {
      newErrors.dayEnd = 'End day must be after start day';
    }

    if (!formData.isRecurring && !formData.year) {
      newErrors.year = 'Year is required for non-recurring events';
    }

    if (formData.isRecurring && formData.yearStart && formData.yearEnd) {
      if (formData.yearEnd < formData.yearStart) {
        newErrors.yearEnd = 'End year must be after start year';
      }
    }

    if (eventType === 'participant' && !formData.participantId) {
      newErrors.participantId = 'Participant is required';
    }

    if (eventType === 'party' && !formData.partyId) {
      newErrors.partyId = 'Party is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="event-form-container">
      <h2 className="form-title">
        {eventId ? 'Edit Event' : 'Create New Event'}
      </h2>

      <form onSubmit={handleSubmit} className="event-form">
        {/* Event Name */}
        <div className="form-group">
          <label htmlFor="eventName" className="form-label">
            Event Name *
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            className={`form-input ${errors.eventName ? 'error' : ''}`}
          />
          {errors.eventName && <span className="error-message">{errors.eventName}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description (optional)"
            className="form-textarea"
            rows={3}
          />
        </div>

        {/* Day Range */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="day" className="form-label">
              Start Day *
            </label>
            <input
              type="number"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              min="1"
              className={`form-input ${errors.day ? 'error' : ''}`}
            />
            {errors.day && <span className="error-message">{errors.day}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dayEnd" className="form-label">
              End Day (optional)
            </label>
            <input
              type="number"
              id="dayEnd"
              name="dayEnd"
              value={formData.dayEnd || ''}
              onChange={handleChange}
              min={formData.day}
              className={`form-input ${errors.dayEnd ? 'error' : ''}`}
            />
            {errors.dayEnd && <span className="error-message">{errors.dayEnd}</span>}
          </div>
        </div>

        {/* Recurring */}
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="form-checkbox"
          />
          <label htmlFor="isRecurring" className="form-label">
            Recurring Event
          </label>
        </div>

        {/* Year (for non-recurring) */}
        {!formData.isRecurring && (
          <div className="form-group">
            <label htmlFor="year" className="form-label">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year || ''}
              onChange={handleChange}
              min="1"
              className={`form-input ${errors.year ? 'error' : ''}`}
            />
            {errors.year && <span className="error-message">{errors.year}</span>}
          </div>
        )}

        {/* Year Range (for recurring) */}
        {formData.isRecurring && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="yearStart" className="form-label">
                Start Year
              </label>
              <input
                type="number"
                id="yearStart"
                name="yearStart"
                value={formData.yearStart || ''}
                onChange={handleChange}
                min="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearEnd" className="form-label">
                End Year (optional)
              </label>
              <input
                type="number"
                id="yearEnd"
                name="yearEnd"
                value={formData.yearEnd || ''}
                onChange={handleChange}
                min={formData.yearStart || 1}
                className={`form-input ${errors.yearEnd ? 'error' : ''}`}
              />
              {errors.yearEnd && <span className="error-message">{errors.yearEnd}</span>}
            </div>
          </div>
        )}

        {/* Participant Selection */}
        {eventType === 'participant' && (
          <div className="form-group">
            <label htmlFor="participantId" className="form-label">
              Participant *
            </label>
            <select
              id="participantId"
              name="participantId"
              value={formData.participantId || ''}
              onChange={handleChange}
              className={`form-input ${errors.participantId ? 'error' : ''}`}
            >
              <option value="">Select a participant</option>
              {participants?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
            {errors.participantId && (
              <span className="error-message">{errors.participantId}</span>
            )}
          </div>
        )}

        {/* Party Selection */}
        {eventType === 'party' && (
          <div className="form-group">
            <label htmlFor="partyId" className="form-label">
              Party *
            </label>
            <select
              id="partyId"
              name="partyId"
              value={formData.partyId || ''}
              onChange={handleChange}
              className={`form-input ${errors.partyId ? 'error' : ''}`}
            >
              <option value="">Select a party</option>
              {parties?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.partyId && <span className="error-message">{errors.partyId}</span>}
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && <div className="form-error">{errors.submit}</div>}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary"
          >
            {mutation.isPending ? 'Saving...' : eventId ? 'Update Event' : 'Create Event'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;