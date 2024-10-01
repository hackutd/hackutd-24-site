import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface DeleteProfileDialogProps {
  closeModalHandler: () => void;
  confirmDeletionHandler: () => Promise<void>;
  showDialog: boolean;
}

export default function DeleteProfileDialog({
  showDialog,
  closeModalHandler,
  confirmDeletionHandler,
}: DeleteProfileDialogProps) {
  return (
    <Transition appear show={showDialog} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModalHandler}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Delete Application
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete your application? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-x-3">
                  <button
                    type="button"
                    className="font-fredoka transition py-3 font-semibold px-6 text-sm text-center whitespace-nowrap text-white w-min bg-gray-400 rounded-full cursor-pointer hover:brightness-110"
                    onClick={closeModalHandler}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="font-fredoka transition py-3 font-semibold px-6 text-sm text-center whitespace-nowrap text-white w-min bg-red-400 rounded-full cursor-pointer hover:brightness-110"
                    onClick={async () => {
                      await confirmDeletionHandler();
                    }}
                  >
                    Delete Application
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
