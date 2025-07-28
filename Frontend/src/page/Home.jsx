import React, { useEffect, useState } from 'react';
import HomeHeader from '../Component/HomeHeader';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/product/all') // 🔁 Your backend route
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <>
      <HomeHeader />
      <div className="bg-gray-100 min-h-screen px-4 py-6">
        <h1 className="text-xl font-bold mb-6 text-center text-green-600">📢 Campus Buy & Sell</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products listed yet.</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 border border-gray-300"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-indigo-700">{product.title}</h2>
                    <p className="text-sm text-gray-600 mb-1">
                      {product.description.length > 60
                        ? product.description.slice(0, 60) + '...'
                        : product.description}
                    </p>
                    <p className="text-green-700 font-medium mb-1">
                      ₹{product.price} {product.negotiable ? '(Negotiable)' : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      👤 Posted by: {product.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-400">
                      🕒 {new Date(product.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
