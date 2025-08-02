import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
  addProduct,
  updateProduct,
  removeProduct,
} from "../utils/appSlice";
import HomeHeader from "../Component/HomeHeader";

// Initialize socket connection
const socket = io("http://localhost:5000");

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
    socket.on("new_product", (product) => {
      dispatch(addProduct(product));
    });

    socket.on("update_product", (product) => {
      dispatch(updateProduct(product));
    });

    socket.on("delete_product", (productId) => {
      dispatch(removeProduct(productId));
    });

    return () => {
      socket.off("new_product");
      socket.off("update_product");
      socket.off("delete_product");
    };
  }, [dispatch]);

  return (
    <>
      <HomeHeader />

      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      <motion.div
        className="min-h-screen px-3 sm:px-4 py-4 pb-20 sm:pb-28"
        style={{
          background:
            "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 50%, #f3e8ff 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-center text-xl sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center justify-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mr-2"></span> Buy & Sell Marketplace
        </motion.h1>

        {/* Loading State */}
        <AnimatePresence>
          {useSelector((store) => store.app.loading) && (
            <motion.div
              className="flex justify-center items-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {useSelector((store) => store.app.error) && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <span className="block sm:inline">
                {useSelector((store) => store.app.error)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 32px rgba(60,60,180,0.12)",
              }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              {/* New Label for recently added products */}
              {new Date(product.createdAt).getTime() >
                Date.now() - 86400000 && (
                <motion.div
                  className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow font-bold px-3 py-1 rounded-bl-lg z-10"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  NEW
                </motion.div>
              )}

              {/* Product Images */}
              {product.images?.length > 0 ? (
                <motion.div
                  className="relative h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(product.images[0])}
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  />
                  {product.images.length > 1 && (
                    <motion.div
                      className="absolute bottom-2 right-2 flex space-x-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {product.images.slice(1, 4).map((img, i) => (
                        <motion.div
                          key={i}
                          className="w-8 h-8 rounded-md overflow-hidden border border-white cursor-pointer hover:opacity-80"
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(img);
                          }}
                        >
                          <img
                            src={img}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                      {product.images.length > 4 && (
                        <motion.div
                          className="w-8 h-8 rounded-md bg-black bg-opacity-60 flex items-center justify-center text-white text-xs border border-white"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                        >
                          +{product.images.length - 4}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 bg-gray-100 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-gray-400">No image</span>
                </motion.div>
              )}

              {/* Product Info */}
              <motion.div
                className="flex-grow"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-1">
                  <motion.h2
                    className="font-semibold text-indigo-700 text-base sm:text-lg line-clamp-1"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.title}
                  </motion.h2>
                  <motion.span
                    className="bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded capitalize"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.category || "Other"}
                  </motion.span>
                </div>

                <motion.p
                  className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.description}
                </motion.p>

                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <motion.p
                      className="text-green-600 font-medium text-base sm:text-lg"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ₹{product.price}
                      {product.negotiable && (
                        <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                          (Negotiable)
                        </span>
                      )}
                    </motion.p>
                    <motion.p
                      className="text-[10px] sm:text-xs text-gray-400"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {new Date(product.createdAt).toLocaleDateString()}
                    </motion.p>
                  </div>

                  <div className="flex justify-between items-center mt-1 sm:mt-2">
                    <div>
                      <motion.span
                        className="text-[10px] sm:text-xs text-gray-500 capitalize"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Condition: {product.condition || "Not specified"}
                      </motion.span>
                      <motion.div
                        className="text-[10px] sm:text-xs text-gray-500 mt-1"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Seller: {product.user?.name || "Unknown"}
                      </motion.div>
                    </div>
                    <motion.button
                      className="text-indigo-600 text-xs sm:text-sm hover:underline"
                      whileHover={{ scale: 1.1, color: "#4338ca" }}
                    >
                      Contact Seller
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {!useSelector((store) => store.app.loading) &&
          products.length === 0 && (
            <motion.div
              className="text-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-500">
                No products available at the moment.
              </p>
            </motion.div>
          )}
      </motion.div>
    </>
  );
}

export default Home;
