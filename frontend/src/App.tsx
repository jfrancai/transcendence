import { SocketContextProvider } from './contexts/socket';
import Chat from './features/Chat/Chat';

function App() {
  return (
    <div>
      <SocketContextProvider>
        <Chat />
      </SocketContextProvider>
    </div>
  );
}

export default App;
