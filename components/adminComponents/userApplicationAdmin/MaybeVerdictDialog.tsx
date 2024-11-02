import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface MaybeVerdictDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  onMaybeNo: () => void;
  onMaybeYes: () => void;
}

export default function MaybeVerdictDialog({
  isOpen,
  closeModal,
  onMaybeYes,
  onMaybeNo,
}: MaybeVerdictDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  Maybe Verdict
                </Dialog.Title>
                <div className="my-5 flex gap-x-6 justify-around">
                  <button
                    className="rounded-full bg-transparent text-[rgba(66,184,187,1)] border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-red-500 hover:text-white hover:bg-red-500 transition"
                    onClick={() => onMaybeNo()}
                  >
                    MAYBE NO
                  </button>
                  <button
                    className="rounded-full bg-[rgba(66,184,187,1)] text-white border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-green-500 hover:bg-green-500 transition"
                    onClick={() => onMaybeYes()}
                  >
                    MAYBE YES
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
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
