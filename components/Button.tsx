import clsx from "clsx";
import { forwardRef, ButtonHTMLAttributes } from "react";
import Spinner from "@/components/Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

const SolidButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, loading = false, loadingText, disabled, ...attrs }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "bg-primary text-white px-5 rounded-lg hover:opacity-90 h-[48px]",
          {
            "!opacity-50 cursor-not-allowed": disabled,
          },
          className
        )}
        {...attrs}
      >
        {loading ? (
          <div className="flex items-center space-x-2.5">
            <Spinner className="h-5 w-5" />
            {loadingText && <p className="text-sm">{loadingText}</p>}
          </div>
        ) : (
          attrs.children
        )}
      </button>
    );
  }
);

SolidButton.displayName = "Button";

export default SolidButton;
