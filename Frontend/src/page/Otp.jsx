import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Otp() {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(6).fill(""));

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").slice(0, 6);
        if (/^\d{6}$/.test(pasted)) {
            const otpArray = pasted.split("");
            setOtp(otpArray);
            otpArray.forEach((char, i) => {
                if (inputRefs.current[i]) {
                    inputRefs.current[i].value = char;
                }
            });
            inputRefs.current[5].focus();
        }
    };

    const handleVerify = async () => {
        const fullOtp = otp.join("").trim();
        const email = localStorage.getItem("tempEmail");
        const password = localStorage.getItem("tempPassword");

        if (fullOtp.length !== 6) {
            alert("Please enter a 6-digit OTP");
            return;
        }

        try {
            console.log("Verifying OTP:", fullOtp, "for email:", email);

            const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp: fullOtp, password }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("✅ Registration successful! Please login.");
                localStorage.removeItem("tempEmail");
                localStorage.removeItem("tempPassword");
                navigate("/login");
            } else {
                alert(data.message || "❌ OTP verification failed");
            }
        } catch (err) {
            console.error(err);
            alert("❌ Server error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="flex flex-col items-center md:max-w-[423px] w-[380px] bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
                <p className="text-2xl font-semibold text-gray-900">Email Verify OTP</p>
                <p className="mt-2 text-sm text-gray-900/90 text-center">
                    Enter the 6-digit code sent to your email ID.
                </p>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 w-11/12 mt-8">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={value}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="w-full h-12 bg-indigo-50 text-gray-900 text-xl rounded-md outline-none text-center focus:ring-2 focus:ring-indigo-400"
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleVerify}
                    className="mt-8 w-full max-w-80 h-11 rounded-full text-white text-sm bg-indigo-500 hover:opacity-90 transition-opacity"
                >
                    Verify Email
                </button>
            </div>
        </div>
    );
}

export default Otp;
