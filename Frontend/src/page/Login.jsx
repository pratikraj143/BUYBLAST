import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetShowPassword,
  updateLoginForm,
  setToken,
  setAuthenticated,
  setUser,
  resetLoginForm,
  setProfile,
} from "../utils/userSlice";
import { hideLoginButton } from "../utils/headerSlice";
import { setCurrentPage } from "../utils/appSlice";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Component/Header.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { showpassword, loginForm } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(hideLoginButton());
    dispatch(setCurrentPage("login"));
  }, [dispatch]);

  const handleChange = (e) => {
    dispatch(updateLoginForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://buy-and-blast.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));

        const userData = data.user || { email: loginForm.email };
        dispatch(setUser(userData));

        dispatch(
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            branch: userData.branch || "",
            whatsapp: userData.whatsappNumber || "",
          })
        );

        dispatch(resetLoginForm());

        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        toast.error(data.message || "Invalid credentials", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Server error. Please try again later.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    dispatch(SetShowPassword());
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] h-full">
        <div className="min-h flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex h-[400px] w-6/10 mx-auto shadow-lg rounded-lg overflow-hidden">
            {/* Left Image Section */}
            <div className="w-full hidden md:inline-block">
              <img
                className="h-full w-full object-cover p-3"
                src="https://res.cloudinary.com/dzkprawxw/image/upload/v1754252837/sign-in_ahpmg5.png"
                alt="Login visual"
              />
            </div>

            {/* Right Form Section */}
            <div className="w-full flex flex-col items-center justify-center p-4">
              <form
                onSubmit={handleSubmit}
                className="md:w-96 w-80 flex flex-col items-center justify-center"
              >
                <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                <p className="text-sm text-gray-500/90 mt-3">
                  Welcome back! Please sign in to continue
                </p>
                <p className="text-center text-sm text-gray-600 mt-2 mb-4">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Register now
                  </Link>
                </p>

                {/* Email Field */}
                <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-4">
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleChange}
                    placeholder="Email ID"
                    className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="relative flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full pl-6 pr-12 gap-2">
                  <input
                    type={showpassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-4 text-xl text-gray-500 hover:text-pink-600 focus:outline-none cursor-pointer transition-colors"
                  >
                    {showpassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Remember Me and Forgot */}
                <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                  <div className="flex items-center gap-2">
                    <input className="h-5" type="checkbox" id="checkbox" />
                    <label className="text-sm" htmlFor="checkbox">
                      Remember me
                    </label>
                  </div>
                  <a className="text-sm underline" href="#">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`cursor-pointer mt-8 w-full h-11 rounded-full text-white transition-opacity ${
                    loading
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-500 hover:opacity-90"
                  }`}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 ">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75 "
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
