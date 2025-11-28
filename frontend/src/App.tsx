import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1>RPG Diary</h1>
        <p>Frontend is ready!</p>
      </div>
    </QueryClientProvider>
  );
}

export default App;