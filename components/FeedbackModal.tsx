import { useState } from "react";
import clsx from "clsx";
import Modal from "react-modal";
import Rating from "react-rating";
import { HiX } from "react-icons/hi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import Button from "@/components/Button";
import { API } from "@/lib/site";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // The old version set sent before the request answered, so a failed send
  // still thanked the reader.
  const send = async () => {
    if (!rating) {
      setRatingError("Please select a rating");
      return;
    }

    setRatingError(null);
    setSendError(null);
    setSending(true);

    try {
      const response = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message }),
      });

      if (!response.ok) throw new Error(String(response.status));
      setSent(true);
    } catch {
      setSendError("That did not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    onClose();
    setRating(null);
    setMessage("");
    setRatingError(null);
    setSendError(null);
    setSent(false);
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={close}
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-40"
      className="w-[calc(100%-20px)] max-w-[640px] max-h-[calc(100vh-80px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1d140c] text-[#efe3cd] border border-[#c9a22759] rounded-xl flex flex-col min-h-0 text-base pb-5"
    >
      <div className="flex justify-end">
        <button onClick={close} className="p-5 !pb-2" aria-label="Close">
          <HiX className="text-2xl" />
        </button>
      </div>

      <div className="overflow-auto overscroll-contain mt-1 px-6 md:px-9">
        <h2 className="text-3xl font-semibold mb-4 font-bantiqua">Feedback</h2>

        <p className="mb-8 opacity-70">
          We keep working on the generator, and your feedback tells us what to
          build next.
        </p>

        <label className="block mb-2 font-semibold">
          How likely are you to recommend this to a friend?*
        </label>

        {/* @ts-ignore react-rating ships loose types */}
        <Rating
          className="space-x-1"
          initialRating={rating ?? 0}
          fractions={2}
          fullSymbol={<FaStar className="h-[38px] w-[36px] text-[#c9a227]" />}
          emptySymbol={
            <FaRegStar className="h-[38px] w-[36px] text-[#efe3cd66]" />
          }
          onChange={(value: number) => setRating(value)}
        />
        {ratingError && (
          <p className="text-sm text-red-400 mt-1">{ratingError}</p>
        )}

        <label className="block mt-5 mb-2 font-semibold" htmlFor="comment">
          Message
        </label>
        <textarea
          id="comment"
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full bg-[#efe3cd0f] border border-[#efe3cd33] rounded-lg p-2 outline-none resize-none focus:border-[#c9a227]"
        />

        <div className="w-full flex items-center text-sm justify-end space-x-3 mt-4">
          {sent && <span>Message sent, thank you.</span>}
          {sendError && <span className="text-red-400">{sendError}</span>}
          <Button
            onClick={send}
            disabled={sent || sending}
            loading={sending}
            loadingText="Sending"
            className={clsx(
              "flex items-center justify-center space-x-2 !bg-[#c9a227] !text-[#1a1209] font-semibold",
              { "!bg-green-600 !text-white": sent }
            )}
            aria-label="Send feedback"
          >
            <RiSendPlaneFill className="text-lg" />
            <span className="ml-2">Send</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
