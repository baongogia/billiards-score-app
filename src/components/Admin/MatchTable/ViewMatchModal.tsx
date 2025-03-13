import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MatchData } from "../../../services/Admin/Matches/matchesService";

interface ViewMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchData | null;
}

const ViewMatchModal: React.FC<ViewMatchModalProps> = ({ isOpen, onClose, match }) => {
  if (!isOpen || !match) return null;

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
                  Match Details
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>ID:</strong> {match.match._id}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Mode Game:</strong> {match.match.mode_game}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Pool Table:</strong> {match.match.pooltable}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Status:</strong> {match.match.status}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Created At:</strong> {new Date(match.match.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>End At:</strong> {new Date(match.match.endAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Updated At:</strong> {new Date(match.match.updatedAt).toLocaleDateString()}
                  </p>
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
  );
};

export default ViewMatchModal;