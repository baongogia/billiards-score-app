import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { PoolTable } from "../../../services/Admin/Tables/poolTableService";

interface ViewTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: PoolTable | null;
}

const ViewTableModal: React.FC<ViewTableModalProps> = ({ isOpen, onClose, table }) => {
  if (!isOpen || !table) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#394264] p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-4xl font-bold text-center text-white mb-6">
                  Table Details
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <p className="text-lg text-white">
                    <strong>ID:</strong> {table._id}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Status:</strong> {table.status}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Type:</strong> {table.tableType.type_name}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Compatible Modes:</strong> {table.tableType.compatible_mode.join(", ")}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Store:</strong> {table.store}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Created At:</strong> {new Date(table.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-lg text-white">
                    <strong>QR Code:</strong>
                  </p>
                  <img src={table.qrCodeImg} alt="QR Code" className="w-48 h-48 object-contain" />
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-lg font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
  );
};

export default ViewTableModal;