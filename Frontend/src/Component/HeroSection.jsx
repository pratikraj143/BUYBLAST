import React from 'react';
import { Link } from 'react-router-dom';
const HeroSection = () => {

  return (
    <section
      id="section"
      className="bg-gradient-to-b from-[#f7f9ff] via-[#fffbee] to-[#f7f9ff] h-full"

    >
      <main className="flex-grow flex flex-col items-center px-6 sm:px-10 max-w-7xl mx-auto w-full">
   

        <h1 className="mt-12 text-center text-gray-900 font-semibold text-3xl sm:text-4xl md:text-5xl max-w-2xl leading-tight">
          Online retail and smart selling. <span className="text-indigo-600">The smart way to buy, sell, and grow.</span>
        </h1>

        <p className="mt-4 text-center text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
          Built by hustlers. Trusted by doers. <br />
          💞Loved by customers.
        </p>
        <Link to="/signup">
          <button className="mt-8 bg-indigo-600 text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700 transition cursor-pointer">
            <span>Swipe, Sell, Success. Explore..</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Link>
       

        {/* Images */}
        <div
          aria-label="Product Images"
          className="mt-12 mb-8 flex flex-wrap justify-center gap-6 max-w-6xl w-full mx-auto px-4"
        >
          {[
            {
              src: "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/a159ebee-e866-414a-9d5f-845166b15d1e.png",
              price: "₹9,999/-"
            },
            {
              src: "https://bing.com/th/id/BCO.fcad4fb9-52af-4553-b7d8-e154e9eca980.png",
              price: "₹299/-"
            },
            {
              src: "https://bing.com/th/id/BCO.14d38a4d-2dbf-4ff8-a5dc-11edf005dd1d.png",
              price: "₹999/-"
            },
            {
              src: "https://bing.com/th/id/BCO.341db3c1-5582-41d1-ab04-8ccf4ebe1cc6.png",
              price: "₹99/-"
            },
            {
              src: "https://cdn.thewirecutter.com/wp-content/media/2024/09/iphone-2048px-6990.jpg?auto=webp&quality=75&width=1024",
              price: "₹10,999/-"
            }
          ].map((item, index) => (
            <Link to="/signup" key={index} className="relative w-47 h-54 rounded-lg overflow-hidden hover:-translate-y-1 transition duration-300 flex-shrink-0">
              <img
                src={item.src}
                alt={`Product ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-white/80 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded">
                Starting from {item.price}
              </div>
            </Link>
          ))}
        </div>

      </main>
    </section>
  );
};

export default HeroSection;
