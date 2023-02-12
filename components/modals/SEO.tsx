import clsx from "clsx";
import { HiX } from "react-icons/hi";

interface Props {
  overlayClassName?: string;
  className?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SEO({
  className,
  overlayClassName,
  open,
  onClose,
  children,
}: Props) {
  return (
    <div
      onClick={onClose}
      className={clsx(
        "fixed inset-0 bg-gray-700 bg-opacity-80 z-40",
        overlayClassName,
        {
          invisible: !open,
        }
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "w-[calc(100%-20px)] max-w-[800px] max-h-[calc(100vh-80px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl flex flex-col min-h-0 text-base pb-5",
          className
        )}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="p-5 !pb-2">
            <HiX className="text-2xl" />
          </button>
        </div>

        <div className="overflow-auto overscroll-contain mt-1 px-6 md:px-9 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
