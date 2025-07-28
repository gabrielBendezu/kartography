import React, { useState, useEffect } from 'react';

const ChatBox = ({ channel }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Listen for new messages
    channel.on("new_msg", payload => {
      setMessages(prev => [...prev, payload.body]);
    });

    // Cleanup on unmount
    return () => {
      channel.off("new_msg");
    };
  }, [channel]);

  const sendMessage = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      channel.push("new_msg", { body: inputValue });
      setInputValue('');
    }
  };

  return (
    <div>
      <h3>Chat</h3>
      <div style={{ border: '1px solid #ccc', height: '100px', overflowY: 'auto', padding: '10px', marginBottom: '10px', background: 'white' }}>
        {messages.map((message, index) => (
          <p key={index}>[{new Date().toString()}] {message}</p>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={sendMessage}
        placeholder="Type a message and press Enter..."
        style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default ChatBox;