import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductForm, resetProductForm, setUploadLoading, setUploadError, addMyProduct } from '../utils/productSlice';
import { setCurrentPage } from '../utils/appSlice';
import { useAuth } from '../utils/authUtils';
import HomeHeader from '../Component/HomeHeader';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

function ListProductForm() {
  const dispatch = useDispatch();
  const { productForm, uploadLoading, uploadError } = useSelector(store => store.product);
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    dispatch(setCurrentPage('sell'));
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => {
      dispatch(resetProductForm());
      if (newSocket) newSocket.disconnect();
    };
  }, [dispatch]);

  const handleImageChange = (e) => {
    dispatch(updateProductForm({ images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productForm.images.length === 0) {
      alert('Please select at least one image.');
      return;
    }
    dispatch(setUploadLoading(true));
    dispatch(setUploadError(null));
    const formData = new FormData();
    formData.append('title', productForm.title);
    formData.append('description', productForm.description);
    formData.append('category', productForm.category);
    formData.append('condition', productForm.condition);
    formData.append('price', productForm.price);
    formData.append('negotiable', productForm.negotiable);
    productForm.images.forEach((img) => {
      formData.append('images', img);
    });
    try {
      const res = await fetch('http://localhost:5000/api/product/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Product uploaded successfully!');
        dispatch(addMyProduct(data.product));
        if (socket) {
          socket.emit('new_product', data.product);
        }
        dispatch(resetProductForm());
      } else {
        dispatch(setUploadError(data.error || data.message || 'Something went wrong.'));
        alert(data.error || data.message || 'Something went wrong.');
      }
    } catch (err) {
      dispatch(setUploadError('Error submitting form.'));
      alert('Error submitting form.');
    } finally {
      dispatch(setUploadLoading(false));
    }
  };

  return (
    <motion.div
      className="min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 50%, #f3e8ff 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <HomeHeader />
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 my-2 sm:my-4 w-full max-w-lg mx-auto p-3 sm:p-4 rounded-lg border border-gray-300 space-y-3 sm:space-y-4 shadow-xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.h2
          className="text-base sm:text-lg font-semibold text-gray-800"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          List Your Product
        </motion.h2>

        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label className="font-medium text-sm sm:text-base" htmlFor="title">Product Title</label>
          <motion.input
            id="title"
            type="text"
            value={productForm.title}
            onChange={(e) => dispatch(updateProductForm({ title: e.target.value }))}
            placeholder="Enter product title"
            required
            className="w-full border mt-1 sm:mt-1.5 border-gray-300 outline-none rounded py-2 sm:py-2.5 px-3 text-sm sm:text-base"
            whileFocus={{ scale: 1.03, borderColor: "#6366f1" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label className="font-medium text-sm sm:text-base" htmlFor="description">Description</label>
          <motion.textarea
            id="description"
            rows={4}
            value={productForm.description}
            onChange={(e) => dispatch(updateProductForm({ description: e.target.value }))}
            placeholder="Describe your product"
            required
            className="w-full resize-none border mt-1 sm:mt-1.5 border-gray-300 outline-none rounded py-2 sm:py-2.5 px-3 text-sm sm:text-base"
            whileFocus={{ scale: 1.03, borderColor: "#6366f1" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label className="font-medium text-sm sm:text-base" htmlFor="category">Category</label>
          <motion.select
            id="category"
            value={productForm.category}
            onChange={(e) => dispatch(updateProductForm({ category: e.target.value }))}
            required
            className="w-full mt-1 sm:mt-1.5 border border-gray-300 rounded py-2 sm:py-2.5 px-3 text-sm sm:text-base"
            whileFocus={{ scale: 1.03, borderColor: "#6366f1" }}
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="vehicles">Vehicles</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="others">Others</option>
          </motion.select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label className="font-medium text-sm sm:text-base" htmlFor="condition">Condition</label>
          <motion.select
            id="condition"
            value={productForm.condition}
            onChange={(e) => dispatch(updateProductForm({ condition: e.target.value }))}
            required
            className="w-full mt-1 sm:mt-1.5 border border-gray-300 rounded py-2 sm:py-2.5 px-3 text-sm sm:text-base"
            whileFocus={{ scale: 1.03, borderColor: "#6366f1" }}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </motion.select>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="font-medium text-sm sm:text-base" htmlFor="price">Price (₹)</label>
            <motion.input
              id="price"
              type="number"
              value={productForm.price}
              onChange={(e) => dispatch(updateProductForm({ price: e.target.value }))}
              placeholder="Enter price"
              required
              className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3"
              whileFocus={{ scale: 1.03, borderColor: "#6366f1" }}
            />
          </div>
          <motion.div
            className="flex items-center mt-7"
            whileHover={{ scale: 1.05 }}
          >
            <input
              id="negotiable"
              type="checkbox"
              checked={productForm.negotiable}
              onChange={(e) => dispatch(updateProductForm({ negotiable: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="negotiable">Price Negotiable</label>
          </motion.div>
        </motion.div>

        <motion.label
          className="font-medium text-sm sm:text-base block mb-1 sm:mb-2"
          htmlFor="images"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Upload Images
        </motion.label>
        <motion.div
          className="border border-dashed border-gray-400 rounded-md p-3 sm:p-4"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02, borderColor: "#6366f1" }}
          transition={{ duration: 0.3 }}
        >
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
            required
          />
        </motion.div>
        <motion.p
          className="text-xs sm:text-sm text-gray-500 mt-1"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Upload up to 5 images (JPG/PNG)
        </motion.p>

        <motion.button
          type="submit"
          disabled={uploadLoading}
          className={`w-full font-medium py-2 sm:py-2.5 rounded mt-3 sm:mt-4 text-sm sm:text-base ${
            uploadLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          whileHover={!uploadLoading ? { scale: 1.05, backgroundColor: "#4338ca" } : {}}
          whileTap={!uploadLoading ? { scale: 0.98 } : {}}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {uploadLoading ? 'Uploading...' : 'Post Product'}
        </motion.button>

        <AnimatePresence>
          {uploadError && (
            <motion.p
              className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {uploadError}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
}

export default ListProductForm;
