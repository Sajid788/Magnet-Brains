import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdExitToApp, MdEditSquare } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsAdmin, setIsLogin, setUser } from "../../Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import "./User.css";

const User = () => {
  // State variables
  const [task, setTask] = useState([]); // Stores user tasks
  const [isActive, setIsActive] = useState(false); // Password field
  const [taskId, setTaskId] = useState(""); // Stores the ID of the task being updated
  const [updatedStatus, setUpdatedStatus] = useState(""); // Stores the updated task status
  
    const togglePopup = () => {
    setIsActive(!isActive);
  };

  

  // Redux setup to access global state
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin); // Checks if the user is an admin
  const isLogin = useSelector((state) => state.isLogin); // Checks if the user is logged in
  const navigate = useNavigate();

  // Toggle the confirmation box for updating task status
  const toggleClass = () => {
    setIsActive(!isActive);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("userInfo"); // Clear user info from local storage
      toast.success("Logout successful"); // Notify user of successful logout
      dispatch(setIsAdmin(false)); // Update global state
      dispatch(setIsLogin(false)); // Update global state
      dispatch(setUser(null)); // Clear user data from global state
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout"); // Notify user of error
    }
  };

  // Fetch user tasks
  const getTasks = useCallback(() => {
    const userDetail = JSON.parse(localStorage.getItem("userInfo"));
    if (userDetail) {
      axios
        .get(`http://localhost:5000/api/task/getemployeetask/${userDetail._id}`)
        .then((response) => {
          setTask(response.data); // Set the fetched tasks in state
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // Update task status on the server
  const updateTaskStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/task/updatetask/${taskId}`, {
        status: updatedStatus, // Send updated status to the server
      });
      toast.success("Task updated successfully"); // Notify user of success
      toggleClass(); // Close the confirmation box
      togglePopup();
      getTasks(); // Refresh task list
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch user tasks on component mount
  useEffect(() => {
    getTasks(); // Call to fetch tasks
  }, [getTasks]);

  // Render user dashboard if not admin and logged in, otherwise redirect to home page
  if (!isAdmin && isLogin) {
    return (
      <div className="alltaskdiv">
        <div className="user-container-main">
          <div className="user">
            <div className="user-nav">
              <h2>User Task Management</h2>
              <p>
                <MdExitToApp className="logout-button" onClick={handleLogout} />
              </p>
            </div>
            <div className="user-task">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Task Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Assign Date</th>
                    <th>Submit Date</th>
                    <th>Status</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {task.map((key, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{key.title}</td>
                      <td>{key.description}</td>
                      <td>{key.priority}</td>
                      <td>{key.startdate}</td>
                      <td>{key.enddate}</td>
                      <td>{key.status}</td>
                      <td
                        onClick={() => {
                          setTaskId(key._id); // Set the task ID to update
                          toggleClass(); // Open the confirmation box
                 
              togglePopup(); // Open the popup
                        }}
                      >
                        <MdEditSquare className="update-task" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirmation box for updating task status */}
          {isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Please</h2>
            <hr className="border-brown-500 mb-4" />
            <p className="text-gray-600 mb-4">
              Do you really want to update the status of this task?
            </p>

            <div className="mb-6">
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Status:
              </label>
              <select
                name="status"
                id="status"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none text-neutral-700 focus:ring focus:ring-blue-300"
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                onClick={updateTaskStatus}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                onClick={togglePopup}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    );
  } else {
    navigate("/"); // Redirect to home if not authorized
    return null; // Render nothing if redirected
  }
};

export default User;
