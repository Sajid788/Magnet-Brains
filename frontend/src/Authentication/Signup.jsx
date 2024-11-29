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

    // Validate input fields
    if (!name || !email || !title || !password) {
      setFile({ ...file, loading: false, error: "All fields are required" });
      toast.warning("All fields are required");
      return;
    }

    try {
      // Send signup request to the server
      const res = await axios.post("http://localhost:5000/api/user/register", {
        name,
        email,
        title,
        password,
        isAdmin: isAdmin === "Yes", // Convert to boolean before sending
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

      // Clear the form and notify success
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

      // Navigate to login page
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
    <div className="background_container_signup">
      <section>
        <h3>Signup</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input_container">
            <label>Name</label>
            <input
              placeholder="Enter Your Name"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label>Email</label>
            <input
              placeholder="Enter Your Email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label>Title</label>
            <input
              placeholder="Enter Your Title"
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label>Password</label>
            <div className="password_container">
              <input
                placeholder="Enter Your Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
              />
              <span
                className="password_toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </div>
          <div className="input_container">
            <label>Admin</label>
            <select
              name="isAdmin"
              value={isAdmin}
              onChange={handleChange}
              className="admin_dropdown"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="btn_container">
            <button className="btn" disabled={loading}>
              {loading ? "Signing up ..." : "Signup"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Signup;
