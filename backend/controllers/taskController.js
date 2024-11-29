const task = require('../models/taskModel');
const employee = require('../models/userModel');

// Controller function to create a new task
const setTask = async (req, res) => {
  try {
    let data = new task(req.body); 
    await data.save();
    // Update the tasks array of the assigned employee
    await employee.findByIdAndUpdate(data.assign.id, {
      $push: { tasks: data._id }, 
    });

    console.log(data);
    res.status(200).json(data); 
  } catch (err) {
    // Error handling
    res.status(404).json({ success: false, message: "internal server error" });
    console.log(err);
  }
};

// Controller function to update an existing task
const updateTask = async (req, res) => {
  try {
    let data = await task.findByIdAndUpdate(req.params.id, req.body); 
    data.save().then((resp) => {
      res.json(resp); 
    });
  } catch (err) {
    // Error handling
    res.status(404).json({ success: false, message: "internal server err" });
    console.log(err);
  }
};

// Controller function to delete a task
const deleteTask = async (req, res) => {
  try {
    let data = await task.findByIdAndDelete(req.params.id); 
    if (data.assign.id) {
      // If task is assigned to an employee, update employee's tasks array
      await employee.findByIdAndUpdate(data.assign.id, {
        $pull: { tasks: data._id }, 
      });
    }
    res.json(data); // Send response with deleted task object
  } catch (err) {
    // Error handling
    res.status(404).json({ success: false, message: "internal server error" });
    console.log(err);
  }
};

// Controller function to get all tasks
const getTask = async (req, res) => {
  try {
    let data = await task.find(); // Find all tasks
    res.json(data); // Send response with all tasks
  } catch (err) {
    // Error handling
    res.status(404).json({ success: false, message: "internal server err" });
    console.log(err);
  }
};

// Controller function to get tasks assigned to a specific employee
const getEmployeeTask = async (req, res) => {
  try {
    let emp_id = req.params.id; 
    console.log("works  " + emp_id);
    let data = await task.find(); // Find all tasks
    data = data.filter((key) => {
      return emp_id == key.assign.id; // Filter tasks by assigned employee ID
    });
    res.json(data); // Send response with filtered tasks
    console.log(data);
  } catch (err) {
    // Error handling
    res.status(404).json({ success: false, message: "internal server err" });
    console.log(err);
  }
};

module.exports = {
  setTask,
  updateTask,
  deleteTask,
  getTask,
  getEmployeeTask,
};
