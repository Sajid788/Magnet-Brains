import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDeleteForever } from 'react-icons/md';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Admin.css";

const AllUsers = () => {
  // State to store the list of users
  const [user, setUser] = useState([]);
  // State to toggle the confirmation box for deletion
  const [isActive, setIsActive] = useState(false);
  // State to store the id of the user to be deleted
  const [taskId, setTaskid] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Redux selector to check if the current user is an admin
  const isAdmin = useSelector((state) => state.isAdmin);
  // Hook to navigate programmatically
  const navigate = useNavigate();


  // Function to toggle popup visibility
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Function to handle user deletion
  const deleteUser1 = () => {
    // Add delete logic here
    console.log("User deleted!");
    togglePopup(); // Close the popup after deleting
  };


  // Function to toggle the confirmation box
  const toggleClass = () => {
    setIsActive(!isActive);
  };

  // Function to fetch the list of users from the API
  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/getuser");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Effect hook to fetch users when the component mounts
  useEffect(() => {
    getUser();
  }, []);

  // Function to delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/deleteuser/${taskId}`
      );
      toast.success("User deleted successfully");
      toggleClass();
      togglePopup();
      getUser(); // Fetch users again after deletion
    } catch (err) {
      console.log(err);
    }
  };

  // Render component based on admin status
  if (isAdmin) {
    return (
      <div className="alltaskdiv">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user, index) => {
              return (
                <tr key={index}>
                  <td data-column="S.No">{index + 1}</td>
                  <td data-column="Name">{user.name}</td>
                  <td data-column="Title">{user.title}</td>
                  <td data-column="Email">{user.email}</td>
                  <td data-column="Action" style={{ cursor: "pointer" }}>
                    <MdDeleteForever
                      style={{ color: "darkred", fontSize: "25px" }}
                      onClick={() => {
                        setTaskid(user._id); // Set the selected user's ID
                        togglePopup(); // Open the popup
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Confirmation box for deletion */}
        {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                onClick={deleteUser}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                onClick={togglePopup}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  } else {
    // If not admin, navigate to home page
    navigate("/");
    return null;
  }
};

export default AllUsers;
