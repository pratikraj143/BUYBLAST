import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductForm, resetProductForm, setUploadLoading, setUploadError, addMyProduct } from '../utils/productSlice';
import { setCurrentPage } from '../utils/appSlice';
import { useAuth } from '../utils/authUtils';
import HomeHeader from '../Component/HomeHeader';

function ListProductForm() {
  const dispatch = useDispatch();
  const { productForm, uploadLoading, uploadError } = useSelector(store => store.product);
  const { token } = useAuth();

  useEffect(() => {
    dispatch(setCurrentPage('sell'));
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
      console.log("Upload Response:", data); // 👈 log the actual message

      if (res.ok) {
        alert('✅ Product uploaded successfully!');
        dispatch(addMyProduct(data.product));
        dispatch(resetProductForm());
      } else {
        dispatch(setUploadError(data.error || data.message || 'Something went wrong.'));
        alert(data.error || data.message || 'Something went wrong.');
      }

    } catch (err) {
      console.error("Catch error:", err);
      dispatch(setUploadError('Error submitting form.'));
      alert('Error submitting form.');
    } finally {
      dispatch(setUploadLoading(false));
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <HomeHeader />
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 my-4 w-full max-w-lg mx-auto p-4 rounded-lg border border-gray-300 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800">List Your Product</h2>

        <div>
          <label className="font-medium" htmlFor="title">Product Title</label>
          <input 
            id="title" 
            type="text" 
            value={productForm.title} 
            onChange={(e) => dispatch(updateProductForm({ title: e.target.value }))} 
            placeholder="Enter product title" 
            required 
            className="w-full border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" 
          />
        </div>

        <div>
          <label className="font-medium" htmlFor="description">Description</label>
          <textarea 
            id="description" 
            rows={4} 
            value={productForm.description} 
            onChange={(e) => dispatch(updateProductForm({ description: e.target.value }))} 
            placeholder="Describe your product" 
            required 
            className="w-full resize-none border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" 
          />
        </div>

        <div>
          <label className="font-medium" htmlFor="category">Category</label>
          <select 
            id="category" 
            value={productForm.category} 
            onChange={(e) => dispatch(updateProductForm({ category: e.target.value }))} 
            required 
            className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3"
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="vehicles">Vehicles</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="font-medium" htmlFor="condition">Condition</label>
          <select 
            id="condition" 
            value={productForm.condition} 
            onChange={(e) => dispatch(updateProductForm({ condition: e.target.value }))} 
            required 
            className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium" htmlFor="price">Price (₹)</label>
            <input 
              id="price" 
              type="number" 
              value={productForm.price} 
              onChange={(e) => dispatch(updateProductForm({ price: e.target.value }))} 
              placeholder="Enter price" 
              required 
              className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3" 
            />
          </div>

          <div className="flex items-center mt-7">
            <input 
              id="negotiable" 
              type="checkbox" 
              checked={productForm.negotiable} 
              onChange={(e) => dispatch(updateProductForm({ negotiable: e.target.checked }))} 
              className="mr-2" 
            />
            <label htmlFor="negotiable">Price Negotiable</label>
          </div>
        </div>

        <label className="font-medium block mb-2" htmlFor="images">Upload Images</label>
        <div className="border border-dashed border-gray-400 rounded-md p-4">
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Upload up to 5 images (JPG/PNG)</p>

        <button 
          type="submit" 
          disabled={uploadLoading}
          className={`w-full font-medium py-2.5 rounded mt-4 ${
            uploadLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {uploadLoading ? 'Uploading...' : 'Post Product'}
        </button>
        
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
      </form>
    </div>
  );
}

export default ListProductForm;
