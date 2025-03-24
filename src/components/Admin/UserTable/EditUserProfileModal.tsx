import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { User } from "../../../services/Admin/User/userService";

interface EditUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  user: User | null;
}

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [userData, setUserData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userData);
  };

  if (!user) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Edit User Profile
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={userData.name || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={userData.phone || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={userData.role || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditUserProfileModal;