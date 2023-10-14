import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Fragment, ReactElement } from "react";

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  titleClass?: string;
  size: string;
  children: React.ReactNode;
  buttons?: ReactElement[];
}

export default function Dialog({
  visible,
  onClose,
  title,
  titleClass,
  children,
  size,
  buttons,
}: DialogProps) {
  const handleClose = () => {
    onClose();
  };
  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <HeadlessDialog
          as="div"
          className="relative z-10"
          onClose={handleClose}
        >
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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <HeadlessDialog.Panel
                  className={`w-full  p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${
                    size ? size : "max-w-md"
                  } `}
                >
                  <HeadlessDialog.Title
                    as="h3"
                    className={
                      titleClass
                        ? titleClass
                        : "text-lg font-medium leading-6 text-gray-900"
                    }
                  >
                    {title}
                  </HeadlessDialog.Title>
                  {/* Body */}
                  <div className="mt-2">{children}</div>

                  <div className="flex items-center justify-end gap-3 mt-4">
                    {/* <button
                      type="button"
                      className={classnames(
                        "inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      )}
                      onClick={handleClose}
                    >
                      {cancelTitle}
                    </button>
                    <button
                      type="button"
                      className={classnames(
                        "inline-flex justify-center px-4 py-2 text-sm font-medium  border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        successClass,
                      )}
                      onClick={handleSuccess}
                    >
                      {successTitle}
                    </button> */}
                    {buttons &&
                      buttons.map((button, idx) => {
                        return button;
                      })}
                  </div>
                </HeadlessDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HeadlessDialog>
      </Transition>
    </>
  );
}
