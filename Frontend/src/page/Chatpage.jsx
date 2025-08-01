import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chatpage = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const bottomRef = useRef();

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
      sender: 'Ankush',
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Real-Time Chat</h2>

        <div className="h-96 overflow-y-auto border p-4 rounded mb-4 bg-gray-50">
          {messages.map((msg, index) => {
            const repliedMessage = getMessageById(msg.replyTo);
            return (
              <div key={msg._id || index} className="mb-4 p-2 bg-white rounded shadow-sm">
                {repliedMessage && (
                  <div className="text-sm text-gray-500 border-l-4 border-indigo-500 pl-2 mb-1">
                    Reply to <strong>{repliedMessage.sender}:</strong> {repliedMessage.text}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold">{msg.sender}:</span> {msg.text}
                    <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Reply
                    </button>
                    {canDelete(msg.timestamp) && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-xs text-red-600 hover:underline"
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

        {replyingTo && (
          <div className="mb-2 p-2 bg-indigo-50 border-l-4 border-indigo-600 text-sm">
            Replying to <strong>{replyingTo.sender}</strong>: {replyingTo.text}
            <button
              onClick={() => setReplyingTo(null)}
              className="ml-2 text-red-600 text-xs hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
