import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  // 🌐 Backend API
  const API = "https://task-management-1-e3g0.onrender.com";

  // 🔐 Auth States
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 Token
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  // 📦 Task States
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // ✏️ Edit States
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔍 Filter
  const [filter, setFilter] = useState("All");

  // ===================================================
  // 🔑 LOGIN
  // ===================================================

  const login = async () => {
    try {

      const res = await axios.post(`${API}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setToken(res.data.token);

      setEmail("");
      setPassword("");

      alert("Login successful ✅");

    } catch (err) {

      console.log(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Backend server not running");
      }
    }
  };

  // ===================================================
  // 📝 REGISTER
  // ===================================================

  const register = async () => {

    try {

      await axios.post(`${API}/api/users/register`, {
        name,
        email,
        password,
      });

      alert("Registration successful ✅");

      setIsLogin(true);

      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {

      console.log(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Backend server not running");
      }
    }
  };

  // ===================================================
  // 🚪 LOGOUT
  // ===================================================

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // ===================================================
  // 📄 GET TASKS
  // ===================================================

  const getTasks = async () => {

    try {

      const res = await axios.get(`${API}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ===================================================
  // ➕ ADD TASK
  // ===================================================

  const addTask = async () => {

    if (!title) return;

    try {

      await axios.post(
        `${API}/api/tasks`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");

      getTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // ===================================================
  // ❌ DELETE TASK
  // ===================================================

  const deleteTask = async (id) => {

    try {

      await axios.delete(`${API}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // ===================================================
  // 🔄 TOGGLE STATUS
  // ===================================================

  const toggleStatus = async (task) => {

    const newStatus =
      task.status === "Done" ? "Todo" : "Done";

    try {

      await axios.put(
        `${API}/api/tasks/${task._id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // ===================================================
  // ✏️ EDIT TASK
  // ===================================================

  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {

    try {

      await axios.put(
        `${API}/api/tasks/${id}`,
        {
          title: editText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditId(null);
      setEditText("");

      getTasks();

    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  // ===================================================
  // 🔍 FILTER TASKS
  // ===================================================

  const filteredTasks = tasks.filter((task) => {

    if (filter === "All") return true;

    if (filter === "Done")
      return task.status === "Done";

    if (filter === "Todo")
      return task.status !== "Done";

    return true;
  });

  // ===================================================
  // 🚀 LOAD TASKS
  // ===================================================

  useEffect(() => {

    if (token) {
      getTasks();
    }

  }, [token]);

  // ===================================================
  // 🎨 UI
  // ===================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center p-6">

      <h1 className="text-4xl font-bold mb-6">
        Task Manager 🚀
      </h1>

      {/* ================================================= */}
      {/* 🔐 AUTH SECTION */}
      {/* ================================================= */}

      {!token ? (

        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">

          {/* Register Name */}
          {!isLogin && (

            <input
              type="text"
              placeholder="Enter Name"
              className="border p-2 w-full mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Login/Register Button */}
          {isLogin ? (

            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
            >
              Login
            </button>

          ) : (

            <button
              onClick={register}
              className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
            >
              Register
            </button>
          )}

          {/* Toggle Auth */}
          <p className="text-center mt-4">

            {isLogin
              ? "New user?"
              : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 ml-2"
            >
              {isLogin ? "Register" : "Login"}
            </button>

          </p>
        </div>

      ) : (

        /* ================================================= */
        /* 📦 TASK SECTION */
        /* ================================================= */

        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-4"
          >
            Logout
          </button>

          {/* Add Task */}
          <div className="flex gap-2 mb-4">

            <input
              className="border p-2 flex-1 rounded"
              placeholder="Enter task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-4">

            {["All", "Todo", "Done"].map((f) => (

              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Task List */}
          <ul className="space-y-2">

            {filteredTasks.map((task) => (

              <li
                key={task._id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >

                {/* Edit Input OR Task Text */}
                {editId === task._id ? (

                  <input
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    className="border p-1 rounded"
                  />

                ) : (

                  <span
                    className={`${
                      task.status === "Done"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                )}

                {/* Buttons */}
                <div className="flex gap-2">

                  {/* Edit */}
                  {editId === task._id ? (
                    <>
                      <button
                        onClick={() =>
                          saveEdit(task._id)
                        }
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  )}

                  {/* Toggle */}
                  <button
                    onClick={() =>
                      toggleStatus(task)
                    }
                    className={`px-2 py-1 text-white rounded ${
                      task.status === "Done"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {task.status === "Done"
                      ? "Undo"
                      : "Done"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="text-red-500"
                  >
                    Delete
                  </button>

                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;