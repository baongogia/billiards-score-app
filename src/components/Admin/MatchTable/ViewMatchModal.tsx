import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MatchData } from '../../../services/Admin/Matches/matchesService';

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
          <div className="flex min-h-full items-center justify-center p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                  Match Details
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-lg text-gray-700">
                    <strong>Match ID:</strong> {match._id}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Mode:</strong> {match.mode_game}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Table ID:</strong> {match.pooltable}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Status:</strong> {match.status}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Started:</strong> {new Date(match.createdAt).toLocaleString()}
                  </p>
                  {match.endAt && (
                    <p className="text-lg text-gray-700">
                      <strong>Ended:</strong> {new Date(match.endAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-6 py-3 text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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