import React, { useState } from 'react';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import type { CalendarEvent } from '../../types/Calendar';
import './EventManager.css';

interface EventManagerProps {
  calendarTypeCode: string;
  year: number;
  day: number;
  monthNumber: number;
  activeParticipantId: number | null;
  onClose: () => void;
  onEventChange?: () => void;
  events?: CalendarEvent[];
}

export const EventManager: React.FC<EventManagerProps> = ({
  calendarTypeCode,
  year,
  day,
  monthNumber,
  activeParticipantId,
  onClose,
  onEventChange,
  events = [],
}) => {
  const [activeTab, setActiveTab] = useState<'holiday' | 'participant' | 'party'>('holiday');
  const [editingEventId, setEditingEventId] = useState<number | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEventId(undefined);
    onEventChange?.(); // Notify parent that events changed
  };

  const handleEdit = (eventId: number, eventType: 'holiday' | 'participant' | 'party') => {
    setActiveTab(eventType);
    setEditingEventId(eventId);
    setShowForm(true);
  };

  return (
    <div className="event-manager-container">
      <div className="event-manager-header">
        <h2>Manage Events - Day {day}</h2>
        <button onClick={onClose} className="btn-close">
          ✕
        </button>
      </div>

      <div className="event-manager-tabs">
        <button
          className={`tab-btn ${activeTab === 'holiday' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('holiday');
            setShowForm(false);
            setEditingEventId(undefined);
          }}
        >
          🗓️ Holidays
        </button>
        <button
          className={`tab-btn ${activeTab === 'participant' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('participant');
            setShowForm(false);
            setEditingEventId(undefined);
          }}
        >
          👤 Participants
        </button>
        <button
          className={`tab-btn ${activeTab === 'party' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('party');
            setShowForm(false);
            setEditingEventId(undefined);
          }}
        >
          👥 Parties
        </button>
      </div>

      <div className="event-manager-content">
        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="btn-add-event"
            >
              + Add {activeTab === 'holiday' ? 'Holiday' : activeTab === 'participant' ? 'Participant Event' : 'Party Event'}
            </button>
            <EventList
              calendarTypeCode={calendarTypeCode}
              year={year}
              day={day}
              monthNumber={monthNumber}
              activeParticipantId={activeParticipantId}
              onEdit={handleEdit}
              onEventChange={onEventChange}
              events={events}
            />
          </>
        ) : (
          <EventForm
            calendarTypeCode={calendarTypeCode}
            year={year}
            day={day}
            eventType={activeTab}
            eventId={editingEventId}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingEventId(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};