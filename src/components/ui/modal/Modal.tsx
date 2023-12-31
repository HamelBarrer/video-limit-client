import { ReactNode } from 'react';
import ClosIcon from '../../icons/ClosIcon';

interface ModalProps {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const Modal = ({ setIsOpenModal, children }: ModalProps) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white p-4 relative">
              <button
                className="absolute top-2 right-2"
                onClick={() => setIsOpenModal(false)}
              >
                <ClosIcon />
              </button>
              <div className="sm:flex sm:items-start">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
