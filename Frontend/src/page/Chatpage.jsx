import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chatpage = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const bottomRef = useRef();
  const currentUser = 'Ankush'; // Current logged-in user

  useEffect(() => {
    axios.get('http://localhost:5000/api/messages')
      .then(res => setMessages(res.data))
      .catch(err => console.log('Error fetching messages:', err));

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('delete_message', (id) => {
      setMessages(prev => prev.filter(msg => msg._id !== id));
    });

    return () => {
      socket.off('receive_message');
      socket.off('delete_message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const messageData = {
      text: newMsg,
      sender: currentUser,
      replyTo: replyingTo?._id || null,
    };

    socket.emit('send_message', messageData);

    setNewMsg('');
    setReplyingTo(null);
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
    } catch (err) {
      console.log('Error deleting message:', err);
    }
  };

  const canDelete = (timestamp) => {
    const oneHour = 60 * 60 * 1000;
    return Date.now() - new Date(timestamp).getTime() <= oneHour;
  };

  const getMessageById = (id) => messages.find(msg => msg._id === id);

  return (
    <div className="chat-dropdown-container flex flex-col h-full w-full">
      <div className="bg-white rounded">
        {replyingTo && (
          <div className="bg-indigo-50 p-1.5 mb-2 rounded flex justify-between items-center">
            <div className="text-xs">
              <span className="font-medium">Replying to {replyingTo.sender}:</span> {replyingTo.text.substring(0, 30)}{replyingTo.text.length > 30 ? '...' : ''}
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 max-h-[300px] sm:max-h-[400px] no-scrollbar">
          {messages.map((msg, index) => {
            const repliedMessage = getMessageById(msg.replyTo);
            const isCurrentUser = msg.sender === currentUser;
            
            return (
              <div 
                  key={msg._id || index} 
                  className={`mb-2 ${isCurrentUser ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-lg max-w-[85%] sm:max-w-[80%] shadow-sm ${isCurrentUser 
                    ? 'bg-blue-100' 
                    : 'bg-white border border-gray-100'}`}
                  >
                  {repliedMessage && (
                    <div className="text-xs text-gray-500 border-l-2 border-indigo-500 pl-2 mb-1">
                      Reply to <strong>{repliedMessage.sender}</strong>: {repliedMessage.text.substring(0, 30)}{repliedMessage.text.length > 30 ? '...' : ''}
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} flex-col`}>
                    <div className="flex items-start gap-1">
                      {!isCurrentUser && <span className="font-semibold text-xs text-gray-700">{msg.sender}</span>}
                      <span className="text-xs">{msg.text}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="text-[10px] text-indigo-600 hover:underline"
                    >
                      Reply
                    </button>
                    {canDelete(msg.timestamp) && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-[10px] text-red-600 hover:underline ml-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>



        <div className="flex gap-1 mt-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-2 py-1 text-xs rounded hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
