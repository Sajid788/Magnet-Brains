import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState({
    name: "",
    email: "",
    title: "",
    password: "",
    isAdmin: "No", // Default value
    error: null,
    loading: false,
  });
  const { name, email, title, password, isAdmin, error, loading } = file;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile({ ...file, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFile({ ...file, loading: true });

    if (!name || !email || !title || !password) {
      setFile({ ...file, loading: false, error: "All fields are required" });
      toast.warning("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/register", {
        name,
        email,
        title,
        password,
        isAdmin: isAdmin === "Yes",
      });

      const data = res.data;
      if (data.success === false) {
        setFile({
          ...file,
          error: data.message,
          loading: false,
        });
        toast.error(data.message);
        return;
      }

      setFile({
        name: "",
        email: "",
        title: "",
        password: "",
        isAdmin: "No",
        error: null,
        loading: false,
      });

      toast.success("Signup successful");
      navigate("/login");
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
    <div className="background_container_signup h-screen bg-slate-50">
      <div className="flex justify-center gap-20  h-full items-center w-[90%] m-auto">
        <div className="max-w-md">
          <div className="flex items-center justify-center">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/task-management-6253704-5122443.png"
              alt=""
              className="w-40 h-24 object-contain"
            />
          </div>
          <div className="mt-12">
            <h1 className="text-5xl font font-bold text-[#2f59d5]">
              {" "}
              Join Us Today and Stay Organized!
            </h1>
          </div>
        </div>

        <div className="bg-white shadow shadow-slate-300 rounded-md p-8 w-[35rem] border border-neutral-300">
          <h3 className="text-3xl font-semibold text-[#2f59d5] text-center">
            Create an Account
          </h3>
          <p className="text-neutral-500 text-center mt-1">
            Let's get started!
          </p>
          <form className="form mt-4 space-y-5" onSubmit={handleSubmit}>
            <div className="flex gap-2">
            <div >
              <label className="text-neutral-500">Name</label>
              <input
                placeholder="Enter Your Name"
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="py-2 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
              />
            </div>
            <div >
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
            </div>

            <div >
              <label className="text-neutral-500">Title</label>
              <input
                placeholder="Enter Your Title"
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                className="py-2 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
            <div className="w-full">
              <label className="text-neutral-500">Password</label>
              <div className="relative">
                <input
                  placeholder="Enter Your Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="py-2 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
                />
                <span
                  className="absolute top-3.5 right-4"
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
            <div className="w-full">
              <label className="text-neutral-500">Admin</label>
              <select
                name="isAdmin"
                value={isAdmin}
                onChange={handleChange}
                className="py-2.5 w-full px-4 rounded-full text-neutral-800 border-2 border-[#2f59d5] mt-1 focus:outline-none"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            </div>
            {error && <p className="error text-neutral-700">{error}</p>}
            <div>
              <button
                className=" mt-4 w-full py-2 bg-[#2f59d5] rounded-full"
                disabled={loading}
              >
                {loading ? "Signing up ..." : "Signup"}
              </button>
              <p className="text-neutral-600 mt-5">
                Already have an account?{" "}
                <span
                  className="text-[#2f59d5] text-lg font-semibold hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
