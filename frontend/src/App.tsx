import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalendarTypeSelector } from './components/Calendar/CalendarTypeSelector';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { PartyList } from './components/Party/PartyList';
import { ParticipantList } from './components/Participant/ParticipantList';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [selectedCalendar, setSelectedCalendar] = useState('pyarr');
  const [activeTab, setActiveTab] = useState<'calendar' | 'parties' | 'karakterek'>('calendar');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>🗓️ Magus Naptár</h1>
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
              <CalendarGrid calendarTypeCode={selectedCalendar} />
            </>
          )}
          {activeTab === 'parties' && <PartyList />}
          {activeTab === 'karakterek' && <ParticipantList />}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;