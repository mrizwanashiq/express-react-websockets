import React, { useEffect, useState } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    // Prompt user for their name
    const username = prompt('Enter your username:');
    setUser(username);

    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:3000');
    setSocket(ws);

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages(prev => [...prev, messageData]);
    };

    ws.onclose = () => {
      console.log('Disconnected from the server');
    };

    // Clean up the connection on component unmount
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'message', user, message: input }));
      setInput('');
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.type === 'message'
              ? `${msg.user}: ${msg.message}`
              : `* ${msg.message}`}
          </li>
        ))}
      </ul>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
