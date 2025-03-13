import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../../services/Admin/User/userService";

export function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Set default values for role and status
  const role = "manager";


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
    <div className="relative flex w-full h-screen overflow-hidden bg-gray-900 z-1 dark:bg-gray-900">
      <div className="flex flex-col flex-1 p-4 rounded-2xl sm:rounded-none sm:border-0 sm:p-6">
        <div className="w-full max-w-md pt-5 mx-auto sm:py-8">
          <Link
            to="/admin/users"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              className="stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to list User
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-2">
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="mb-3 p-2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name<span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 p-2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address<span className="text-error-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 p-2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password<span className="text-error-500">*</span>
              </label>
              <input
                type="password"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 p-2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone<span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Enter phone number"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 w-full px-3 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back to User List
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;