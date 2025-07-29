import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
} from "../utils/appSlice";
import HomeHeader from "../Component/HomeHeader";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.app);

  const [chatFeed, setChatFeed] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    dispatch(setCurrentPage("home"));
    dispatch(setLoading(true));

    fetch("http://localhost:5000/api/product/all")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setProducts(data));
        const productItems = data.map((product) => ({
          id: product._id,
          type: "product",
          data: product,
        }));
        setChatFeed(productItems);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        dispatch(setError("Failed to fetch products"));
      });

    socket.on("init_messages", (msgs) => {
      const messageItems = msgs.map((msg) => ({
        id: Date.now() + Math.random(),
        type: "message",
        text: msg.text,
        replyTo: msg.replyTo || null,
      }));
      setChatFeed((prev) => [...prev, ...messageItems]);
    });

    socket.on("receive_message", (msg) => {
      const newMsg = {
        id: Date.now() + Math.random(),
        type: "message",
        text: msg.text,
        replyTo: msg.replyTo || null,
      };
      setChatFeed((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("init_messages");
      socket.off("receive_message");
    };
  }, [dispatch]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const message = {
      text: inputText.trim(),
      replyTo,
    };

    socket.emit("send_message", message);
    setInputText("");
    setReplyTo(null);
  };

  const handleReply = (item) => {
    if (item.type === "message") {
      setReplyTo({ type: "message", text: item.text });
    } else if (item.type === "product") {
      setReplyTo({
        type: "product",
        text: `Product: ${item.data.title}`,
      });
    }
  };

  return (
    <>
      <HomeHeader />

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

      <div className="bg-gray-100 min-h-screen px-4 py-4 pb-28">
        <h1 className="text-center text-xl font-bold text-indigo-700 mb-4">
          🛍️ Buy & Sell Group
        </h1>

        <div className="space-y-4 max-w-2xl mx-auto">
          {chatFeed.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow border relative"
              >
                {/* Reply Info */}
                {item.replyTo && (
                  <div className="text-sm text-gray-600 italic border-l-4 pl-2 border-blue-400 mb-2">
                    Replying to:{" "}
                    {item.replyTo.type === "message"
                      ? `"${item.replyTo.text}"`
                      : item.replyTo.text}
                  </div>
                )}

                {/* Product */}
                {item.type === "product" && (
                  <>
                    <h2 className="font-semibold text-indigo-700 text-lg">
                      {item.data.title}
                    </h2>
                    <p className="text-gray-600">
                      {item.data.description.length > 60
                        ? item.data.description.slice(0, 60) + "..."
                        : item.data.description}
                    </p>
                    <p className="text-green-600 font-medium">
                      ₹{item.data.price}{" "}
                      {item.data.negotiable ? "(Negotiable)" : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.data.createdAt).toLocaleString()}
                    </p>
                    {item.data.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.data.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="product"
                            className="w-24 h-24 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                            onClick={() => setSelectedImage(img)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Message */}
                {item.type === "message" && (
                  <div className="text-sm text-gray-800">{item.text}</div>
                )}

                <button
                  onClick={() => handleReply(item)}
                  className="absolute top-2 right-2 text-xs text-blue-500 hover:underline"
                >
                  Reply
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white px-4 py-3 border-t shadow-md z-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {replyTo && (
            <div className="text-xs bg-gray-100 p-2 rounded border text-gray-600 flex justify-between items-center">
              Replying to:{" "}
              {replyTo.type === "message"
                ? `"${replyTo.text}"`
                : replyTo.text}
              <button
                onClick={() => setReplyTo(null)}
                className="text-red-500 ml-4"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none bg-gray-100"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
