import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../../services/Admin/User/userService";

export function CreateUser() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      email,
      name,
      password,
      phone,
      role,
    };

    try {
      await registerUser(formData);
      toast.success("Registration successful", {
        position: "top-center",
      });
      navigate("/admin/users"); // Redirect to users page after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#111111]">
      <div className="w-full max-w-md bg-[#394264] p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Create New User
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Create a strong password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter phone number"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="w-full py-3 px-4 text-teal-700 bg-[#394264] rounded-md shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Back to User List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;