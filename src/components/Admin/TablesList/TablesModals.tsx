import React, { useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { PoolTable } from "../../../services/Admin/Tables/poolTableService"

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableData: {
    status: string;
    tableType: {
      type_name: string;
      compatible_mode: string[]
    };
    store: string
  }) => void;
  isEditing: boolean;
  selectedTable?: {
    status: string;
    tableType: {
      type_name: string;
      compatible_mode: string[];
    };
    store: string;
  };
}

export function TableModal({ isOpen, onClose, onSubmit, isEditing, selectedTable }: TableModalProps) {
  const [tableData, setTableData] = useState({
    status: "available",
    tableType: {
      type_name: "",
      compatible_mode: ["8-ball", "9-ball"]
    },
    store: ""
  })

  useEffect(() => {
    if (isEditing && selectedTable) {
      setTableData({
        status: selectedTable.status,
        tableType: {
          type_name: selectedTable.tableType.type_name,
          compatible_mode: selectedTable.tableType.compatible_mode
        },
        store: selectedTable.store
      })
    } else {
      setTableData({
        status: "available",
        tableType: {
          type_name: "",
          compatible_mode: ["8-ball", "9-ball"]
        },
        store: ""
      })
    }
  }, [isEditing, selectedTable])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === "type_name") {
      setTableData(prev => ({
        ...prev,
        tableType: {
          ...prev.tableType,
          type_name: value
        }
      }))
    } else {
      setTableData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(tableData)
  }

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
                  {isEditing ? "Edit Table" : "Add Table"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={tableData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="type_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Table Type
                    </label>
                    <input
                      type="text"
                      name="type_name"
                      id="type_name"
                      value={tableData.tableType.type_name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="store" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Store ID
                    </label>
                    <input
                      type="text"
                      name="store"
                      id="store"
                      value={tableData.store}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isEditing ? "Update Table" : "Add Table"}
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
  )
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  successData?: PoolTable;
}

export function SuccessModal({ isOpen, onClose, successData }: SuccessModalProps) {
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
                  Success
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {successData 
                      ? `Table ${successData.tableType.type_name} (ID: ${successData._id.substring(0, 8)}...) has been successfully ${successData.createdAt ? 'added' : 'updated'}.`
                      : "Operation completed successfully."}
                  </p>
                  {successData?.qrCodeImg && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">QR Code:</p>
                      <img 
                        src={successData.qrCodeImg} 
                        alt="QR Code" 
                        className="mt-1 w-24 h-24 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}