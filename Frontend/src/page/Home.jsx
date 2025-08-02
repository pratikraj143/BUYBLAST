import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
  addProduct,
  updateProduct,
  removeProduct
} from "../utils/appSlice";
import HomeHeader from "../Component/HomeHeader";

// Initialize socket connection
const socket = io('http://localhost:5000');

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.app);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(setCurrentPage("home"));
    dispatch(setLoading(true));

    // Fetch initial products
    fetch("http://localhost:5000/api/product/all", {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const limitedProducts = data.slice(0, 20);
        dispatch(setProducts(limitedProducts));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        dispatch(setError("Failed to fetch products"));
      })
      .finally(() => dispatch(setLoading(false)));

    // Listen for real-time product updates
    socket.on('new_product', (product) => {
      dispatch(addProduct(product));
    });

    socket.on('update_product', (product) => {
      dispatch(updateProduct(product));
    });

    socket.on('delete_product', (productId) => {
      dispatch(removeProduct(productId));
    });

    return () => {
      socket.off('new_product');
      socket.off('update_product');
      socket.off('delete_product');
    };
  }, [dispatch]);

  return (
    <>
      <HomeHeader />

      {/* Fullscreen Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-w-[90vw] max-h-[90vh] rounded-xl"
          />
        </div>
      )}

      {/* Product List */}
      <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen px-3 sm:px-4 py-4 pb-20 sm:pb-28">
        <h1 className="text-center text-xl sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center justify-center">
          <span className="mr-2">🛍️</span> Buy & Sell Marketplace
        </h1>

        {/* Loading State */}
        {useSelector(store => store.app.loading) && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {useSelector(store => store.app.error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-4">
            <span className="block sm:inline">{useSelector(store => store.app.error)}</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={product._id || index}
              className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col"
            >
              {/* New Label for recently added products */}
              {new Date(product.createdAt).getTime() > Date.now() - 86400000 && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                  NEW
                </div>
              )}
              
              {/* Product Images */}
              {product.images?.length > 0 ? (
                <div className="relative h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(product.images[0])}
                    loading="lazy"
                  />
                  {product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      {product.images.slice(1, 4).map((img, i) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-md overflow-hidden border border-white cursor-pointer hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(img);
                          }}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {product.images.length > 4 && (
                        <div className="w-8 h-8 rounded-md bg-black bg-opacity-60 flex items-center justify-center text-white text-xs border border-white">
                          +{product.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {/* Product Info */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-semibold text-indigo-700 text-base sm:text-lg line-clamp-1">
                    {product.title}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded capitalize">
                    {product.category || 'Other'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-green-600 font-medium text-base sm:text-lg">
                      ₹{product.price}
                      {product.negotiable && (
                        <span className="text-[10px] sm:text-xs text-gray-500 ml-1">(Negotiable)</span>
                      )}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1 sm:mt-2">
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500 capitalize">
                        Condition: {product.condition || 'Not specified'}
                      </span>
                      <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Seller: {product.user?.name || 'Unknown'}
                      </div>
                    </div>
                    <button className="text-indigo-600 text-xs sm:text-sm hover:underline">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {!useSelector(store => store.app.loading) && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
