import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { PoolTable } from "../../../services/Admin/Tables/poolTableService";

interface EditTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableData: Partial<PoolTable>) => void;
  table: PoolTable | null;
}

export function EditTableModal({ isOpen, onClose, onSubmit, table }: EditTableModalProps) {
  const [tableData, setTableData] = useState<Partial<PoolTable>>({
    status: undefined,
    store: ""
  });

  useEffect(() => {
    if (table) {
      setTableData({
        status: table.status,
        store: table.store
      });
    }
  }, [table]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(tableData);
  };

  if (!table) return null;

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
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#394264] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-3xl font-bold text-center text-white mb-4">
                  Edit Table
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={tableData.status}
                      onChange={handleChange}
                      className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    >
                      <option value="">Select status...</option>
                      <option value="available">Available</option>
                      <option value="in_use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="store" className="block text-sm font-medium text-white mb-2">
                      Store <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="store"
                      id="store"
                      value={tableData.store}
                      onChange={handleChange}
                      className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-teal-700 bg-[#394264] rounded-md shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      Update Table
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
}