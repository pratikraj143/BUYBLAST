import React, { useState } from 'react';
import HomeHeader from '../Component/HomeHeader';

function ListProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('price', price);
    formData.append('negotiable', negotiable);

    images.forEach((img) => {
      formData.append('images', img);
    });

    try {
      const token = localStorage.getItem('token'); // ✅ Get token

      const res = await fetch('http://localhost:5000/api/product/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
        body: formData, // ✅ Let browser set the correct multipart/form-data boundary
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Product uploaded successfully!');
        console.log(data);

        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setCondition('');
        setPrice('');
        setNegotiable(false);
        setImages([]);
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form.');
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
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter product title" required className="w-full border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" />
        </div>

        <div>
          <label className="font-medium" htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product" required className="w-full resize-none border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" />
        </div>

        <div>
          <label className="font-medium" htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3">
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
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3">
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium" htmlFor="price">Price (₹)</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3" />
          </div>

          <div className="flex items-center mt-7">
            <input id="negotiable" type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} className="mr-2" />
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

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded mt-4">
          Post Product
        </button>
      </form>
    </div>
  );
}

export default ListProductForm;
