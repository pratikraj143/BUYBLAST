import React from 'react';
import HomeHeader from '../Component/HomeHeader';

function ListProductForm() {
    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            <HomeHeader />

            <form className="bg-white text-gray-700 my-4 w-full max-w-lg mx-auto p-4 rounded-lg border border-gray-300 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">List Your Product</h2>

                {/* Title */}
                <div>
                    <label className="font-medium" htmlFor="title">Product Title</label>
                    <input id="title" type="text" placeholder="Enter product title" required className="w-full border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" />
                </div>

                {/* Description */}
                <div>
                    <label className="font-medium" htmlFor="description">Description</label>
                    <textarea id="description" rows={4} placeholder="Describe your product" required className="w-full resize-none border mt-1.5 border-gray-300 outline-none rounded py-2.5 px-3" />
                </div>

                {/* Category */}
                <div>
                    <label className="font-medium" htmlFor="category">Category</label>
                    <select id="category" required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3">
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="fashion">Fashion</option>
                        <option value="books">Books</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                {/* Condition */}
                <div>
                    <label className="font-medium" htmlFor="condition">Condition</label>
                    <select id="condition" required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3">
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="used">Used</option>
                    </select>
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium" htmlFor="price">Price (₹)</label>
                        <input id="price" type="number" placeholder="Enter price" required className="w-full mt-1.5 border border-gray-300 rounded py-2.5 px-3" />
                    </div>

                    {/* Negotiable */}
                    <div className="flex items-center mt-7">
                        <input id="negotiable" type="checkbox" className="mr-2" />
                        <label htmlFor="negotiable">Price Negotiable</label>
                    </div>
                </div>

                {/* Image Upload */}
                <label className="font-medium block mb-2" htmlFor="images">Upload Images</label>
                <div className="border border-dashed border-gray-400 rounded-md p-4">
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        required
                        className="w-full text-sm"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload up to 5 images (JPG/PNG)</p>

                {/* Post Button */}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded mt-4">
                    Post Product
                </button>
            </form>
        </div>
    );
}

export default ListProductForm;
