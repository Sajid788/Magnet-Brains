import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setIsAdmin, setIsLogin, setUser } from "../Slices/AuthSlice";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Login = () => {
  // State for managing input values and loading/error states
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const { email, password, error, loading } = file;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    setFile({ ...file, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFile({ ...file, loading: true });

    // Check if both fields are filled
    if (!email || !password) {
      setFile({ ...file, loading: false, error: "All fields are required" });
      toast.warning("All fields are required");
      return;
    }

    try {
      // Send login request to server
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      const data = res.data;
      console.log(res.data);
      if (data.success === false) {
        setFile({
          ...file,
          error: data.message,
          loading: false,
        });
        toast.error(data.message);
        return;
      }

      // Clear form state and reset error/loading states
      setFile({
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Login successful");

      // Navigate to appropriate dashboard based on admin status
      if (data.user.isAdmin === true) {
        navigate("/admin");
        dispatch(setIsAdmin(true));
      } else {
        navigate("/user");
        dispatch(setIsAdmin(false));
      }

      // Update Redux state with login status and user details
      dispatch(setIsLogin(true));
      dispatch(setUser(data.user));
    } catch (error) {
      setFile({
        ...file,
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="background_container_login h-screen bg-slate-50 ">
      <div className="flex justify-center gap-20  h-full items-center w-[90%] m-auto  ">
        <div className=" max-w-md ">
          <div className="flex items-center justify-center">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/task-management-6253704-5122443.png"
              alt=""
              className="w-40 h-24 object-contain"
            />
            {/* <h2 className="text-4xl font-semibold text-[#2f59d5]">Task Manager</h2> */}
          </div>
          <div className="mt-12">
            <h1 className="text-5xl font font-bold text-[#2f59d5] ">
              {" "}
              Manage Your Tasks with Effortlessly
            </h1>
          </div>
        </div>

        <div className="bg-white shadow shadow-slate-300 rounded-md p-8 w-96 border border-neutral-300">
          <h3 className="text-3xl font-semibold text-[#2f59d5] text-center">
            Welcome Back!
          </h3>
          <p className="text-neutral-500 text-center mt-1">
            Keep all your credentials safe!
          </p>
          <form className="form mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="input_container">
              <label className="text-neutral-500">Email</label>
              <input
                placeholder="Enter Your Email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="py-2 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
              />
            </div>
            <div className="">
              <label className="text-neutral-500">Password</label>
              <div className=" relative">
                <input
                  placeholder="Enter Your Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="py-2 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
                />
                <span
                  className=" absolute top-3.5 right-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined className="text-neutral-700" />
                  ) : (
                    <EyeOutlined className="text-neutral-700" />
                  )}
                </span>
              </div>
            </div>
            {error && <p className="error text-neutral-700">{error}</p>}
            <div >
              <button
                className="btn mt-4 w-full py-2 bg-[#2f59d5] rounded-full "
                disabled={loading}
              >
                {loading ? "Logging in ..." : "Login"}
              </button>

              <p className="text-neutral-600 mt-5">
                Don’t have an account?{" "}
                <span className="text-[#2f59d5] text-lg font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/Signup")}
                >
                  Sign Up
                </span>
              </p>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
