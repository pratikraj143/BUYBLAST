import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
} from "../utils/appSlice";
import HomeHeader from "../Component/HomeHeader";
import Chatpage from "../page/Chatpage";

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.app);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    dispatch(setCurrentPage("home"));
    dispatch(setLoading(true));

    fetch("http://localhost:5000/api/product/all", { signal: AbortSignal.timeout(5000) })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Limit to 20 products to prevent memory overload
        const limitedProducts = data.slice(0, 20);
        dispatch(setProducts(limitedProducts));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        dispatch(setError("Failed to fetch products"));
      })
      .finally(() => dispatch(setLoading(false)));
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
            onLoad={() => console.log("Image loaded successfully")}
            onError={() => setSelectedImage(null)}
          />
        </div>
      )}

      {/* Product List */}
      <div className="bg-gray-100 min-h-screen px-4 py-4 pb-28">
        <h1 className="text-center text-xl font-bold text-indigo-700 mb-4">
          🛍️ Buy & Sell Group
        </h1>

        <div className="space-y-4 max-w-2xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border relative"
            >
              <h2 className="font-semibold text-indigo-700 text-lg">
                {product.title}
              </h2>
              <p className="text-gray-600">
                {product.description.length > 60
                  ? product.description.slice(0, 60) + "..."
                  : product.description}
              </p>
              <p className="text-green-600 font-medium">
                ₹{product.price} {product.negotiable ? "(Negotiable)" : ""}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(product.createdAt).toLocaleString()}
              </p>
              {product.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.images.slice(0, 3).map((img, i) => ( // Limit to 3 images
                    <img
                      key={i}
                      src={img}
                      alt="product"
                      className="w-24 h-24 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                      onClick={() => setSelectedImage(img)}
                      loading="lazy" // Lazy load images
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in Chat Panel */}
      <Chatpage isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Chat Button (Bottom Right) */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
      >
        Chat
      </button>
    </>
  );
}

export default Home;
