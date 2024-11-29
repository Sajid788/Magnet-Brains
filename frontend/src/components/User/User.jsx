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
            <div className="confirmation-box">
              <h2>Confirm Please</h2>
              <hr size="1" color="brown" />
              <p>Do you really want to update the status of this task?</p>
              <div className="input_container">
                <label>Status:</label>
                <br />
                <select
                  name="status"
                  id="isAdmin"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="confirmation-box-buttons">
                <button style={{ backgroundColor: "green" }} onClick={updateTaskStatus}>
                  Yes
                </button>
                <button style={{ backgroundColor: "red" }} onClick={toggleClass}>
                  No
                </button>
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
