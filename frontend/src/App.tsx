import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CalendarTypeSelector } from './components/Calendar/CalendarTypeSelector';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { PartyList } from './components/Party/PartyList';
import { ParticipantList } from './components/Participant/ParticipantList';
import apiClient from './services/api';
import type { ParticipantDTO } from './types/Participant';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

console.log('QueryClient initialized with refetchOnWindowFocus:', false);

function AppContent() {
  const [selectedCalendar, setSelectedCalendar] = useState('pyarr');
  const [activeTab, setActiveTab] = useState<'calendar' | 'parties' | 'karakterek'>('calendar');
  const [activeParticipantId, setActiveParticipantId] = useState<number | null>(null);

  // Fetch all JK participants
  const { data: participants } = useQuery({
    queryKey: ['participants', 'JK'],
    queryFn: async () => {
      const response = await apiClient.get<ParticipantDTO[]>('/participants');
      // Filter for type 'JK'
      return response.data.filter(p => p.type === 'JK');
    },
  });

  return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="active-participant-selector">
              <label htmlFor="participant-select">👤 Aktív Karakter:</label>
              <select
                id="participant-select"
                value={activeParticipantId || ''}
                onChange={(e) => setActiveParticipantId(e.target.value ? Number(e.target.value) : null)}
                className="participant-select"
              >
                <option value="">-- Válassz karaktert --</option>
                {participants?.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
            <h1>🗓️ Magus Naptár</h1>
          </div>
        </header>
        <nav className="app-nav">
          <button
            className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            📅 Naptár
          </button>
          <button
            className={`nav-btn ${activeTab === 'parties' ? 'active' : ''}`}
            onClick={() => setActiveTab('parties')}
          >
            👥 Partik
          </button>
          <button
            className={`nav-btn ${activeTab === 'karakterek' ? 'active' : ''}`}
            onClick={() => setActiveTab('karakterek')}
          >
            👤 Karakterek
          </button>
        </nav>
        <main className="app-main">
          {activeTab === 'calendar' && (
            <>
              <CalendarTypeSelector
                selectedCalendarCode={selectedCalendar}
                onCalendarChange={setSelectedCalendar}
              />
              <CalendarGrid 
                calendarTypeCode={selectedCalendar} 
                activeParticipantId={activeParticipantId}
              />
            </>
          )}
          {activeTab === 'parties' && <PartyList />}
          {activeTab === 'karakterek' && <ParticipantList />}
        </main>
      </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;