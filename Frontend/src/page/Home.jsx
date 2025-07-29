import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setLoading, setError, setCurrentPage, addProduct } from '../utils/appSlice';
import HomeHeader from '../Component/HomeHeader';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // ⚠️ Change for production

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(store => store.app);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const chatBottomRef = useRef(null);
  const currentUserId = localStorage.getItem('userId'); // ✅ Make sure it's stored after login

  useEffect(() => {
    dispatch(setCurrentPage('home'));
    dispatch(setLoading(true));

    fetch('http://localhost:5000/api/product/all')
      .then(res => res.json())
      .then(data => dispatch(setProducts(data)))
      .catch(err => {
        console.error('Error fetching products:', err);
        dispatch(setError('Failed to fetch products'));
      });

    socket.on('receive_product', (newProduct) => {
      dispatch(addProduct(newProduct));
    });

    socket.on('init_messages', (msgs) => setChatMessages(msgs));
    socket.on('receive_message', (msg) => setChatMessages(prev => [...prev, msg]));

    return () => {
      socket.off('receive_product');
      socket.off('receive_message');
      socket.off('init_messages');
    };
  }, [dispatch]);

  const sendMessage = () => {
    if (!message && !image) return;

    const newMsg = {
      id: Date.now(),
      text: message,
      image,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', newMsg);
    setMessage('');
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setProducts(products.filter((p) => p._id !== productId)));
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <>
      <HomeHeader />

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <img src={selectedImage} alt="Preview" className="max-h-[90vh] max-w-[90vw] rounded-lg" />
        </div>
      )}

      <div className="bg-gray-100 min-h-screen px-4 py-6">
        <h1 className="text-xl font-bold mb-4 text-center text-green-600">📢 Campus Buy & Sell</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto mb-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-indigo-700">{product.title}</h2>
                    <p className="text-sm text-gray-600">
                      {product.description.length > 60 ? product.description.slice(0, 60) + '...' : product.description}
                    </p>
                    <p className="text-green-700 font-medium">₹{product.price} {product.negotiable ? '(Negotiable)' : ''}</p>
                    <p className="text-xs text-gray-400">🕒 {new Date(product.createdAt).toLocaleString()}</p>
                  </div>
                  {product.userId === currentUserId && (
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                  {product.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Product ${i}`}
                      className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Section */}
        <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow p-4 border">
          <h2 className="text-lg font-semibold text-blue-700 mb-3">💬 Live Chat</h2>

          <div className="h-64 overflow-y-auto mb-4 bg-gray-50 rounded p-2 space-y-2">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p-2 bg-blue-100 rounded shadow-sm">
                <p className="text-sm text-gray-800">{msg.text}</p>
                {msg.image && (
                  <img src={msg.image} alt="chat-img" className="w-32 h-32 object-cover mt-2 rounded-md" />
                )}
                <p className="text-xs text-right text-gray-400">{msg.time}</p>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border rounded px-3 py-1"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload" />
            <label htmlFor="img-upload" className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded">📷</label>
            <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-1 rounded">Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
