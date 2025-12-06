import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalendarTypeSelector } from './components/Calendar/CalendarTypeSelector';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { ParticipantList } from './components/Participant/ParticipantList';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [selectedCalendar, setSelectedCalendar] = useState('pyarr');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>🗓️ Magus Diary</h1>
          <p>Track events across multiple calendars</p>
        </header>
        <main className="app-main">
          <CalendarTypeSelector
            selectedCalendarCode={selectedCalendar}
            onCalendarChange={setSelectedCalendar}
          />
          <ParticipantList />
          <CalendarGrid calendarTypeCode={selectedCalendar} />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;