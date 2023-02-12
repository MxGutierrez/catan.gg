import { useState } from "react";
import clsx from "clsx";
import SEOModal from "@/components/modals/SEO";
import Modal from "react-modal";
import Rating from "react-rating";
import { HiX } from "react-icons/hi";
import { RxDotFilled } from "react-icons/rx";
import { FaStar, FaRegStar } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import Button from "@/components/Button";

interface Props {
  className?: string;
}

export default function Footer({ className }: Props) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const sendFeedback = () => {
    if (!rating) {
      setRatingError("Please select a rating");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        message,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    setSent(true);
  };

  const onFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
    setRating(null);
    setMessage("");
    setRatingError(null);
    setSent(false);
  };

  return (
    <footer
      className={clsx(
        "flex items-center justify-center text-sm space-x-1",
        className
      )}
    >
      <SEOModal
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <h2 className="text-3xl lg:text-4xl font-semibold mb-5">
          What is this?
        </h2>
        <p>
          Catan, also known as Settlers of Catan, is a popular board game that
          has been enjoyed by millions of players worldwide. The game is all
          about building settlements, trading resources, and conquering
          territories. However, one of the challenges players face is creating a
          new board every time they play the game. This is where the Awesome
          Catan Board Generator comes in.
        </p>

        <h3 className="mt-8 mb-3 font-semibold text-lg">
          What is the Awesome Catan Board Generator?
        </h3>
        <p>
          The Awesome Catan Board Generator is a tool that generates random
          Catan boards for players to use during their games. It is an
          easy-to-use online app that generates unique Catan boards for each
          game, eliminating the need for players to set up the board manually.
          The generator creates the combinations of hexagonal tiles and the
          numbers, making it easier for players to start playing the game. The
          application is lightweight making it a great tool for mobile devices.
        </p>

        <h3 className="mt-8 mb-3 font-semibold text-lg">How does it work?</h3>
        <p>
          The Awesome Catan Board Generator is straightforward to use. All you
          have to do is click on the "Shuffle" button. The generator will then
          generate a new random Catan board, ready for you to start playing.
        </p>

        <h3 className="mt-8 mb-3 font-semibold text-lg">
          Benefits of Using the Awesome Catan Board Generator
        </h3>
        <p className="mb-3">
          The Awesome Catan Board Generator is a great tool for Catan players,
          offering many benefits. Some of the benefits include:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-2.5">
          <li>
            <span className="underline">Saves Time</span>: No more setting up
            the board manually, the generator does it all for you, saving you
            time and effort.
          </li>

          <li>
            <span className="underline">Replayability</span>: With the
            generator, players can generate as many new boards as they like,
            making each game unique and increasing replayability.
          </li>

          <li>
            <span className="underline">Convenience</span>: Players can access
            the generator from any mobile or desktop device, at any time, making
            it convenient and accessible.
          </li>
        </ul>

        <p>
          So, whether you are a seasoned Catan player, just starting out, or
          playing with your family or friends, the Awesome Catan board generator
          is an excellent tool to enhance the experience.
        </p>
      </SEOModal>

      <Modal
        isOpen={isFeedbackModalOpen}
        onRequestClose={onFeedbackClose}
        overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-80 z-40"
        className="w-[calc(100%-20px)] max-w-[800px] max-h-[calc(100vh-80px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl flex flex-col min-h-0 text-base pb-5"
      >
        <div className="flex justify-end">
          <button onClick={onFeedbackClose} className="p-5 !pb-2">
            <HiX className="text-2xl" />
          </button>
        </div>

        <div className="overflow-auto overscroll-contain mt-1 px-6 md:px-9">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-5">Feedback</h2>

          <p className="mb-8">
            We are constantly working towards enhancing the experience for our
            users, and your valuable feedback plays a crucial role in making
            this happen.
          </p>

          <label className="block mb-2 font-semibold">
            How likely is that you would recommend this app to a friend?*
          </label>

          {/* @ts-ignore */}
          <Rating
            className="space-x-1"
            initialRating={rating ?? 0}
            fractions={2}
            fullSymbol={
              <FaStar className="h-[40px] w-[38px] text-yellow-400" />
            }
            emptySymbol={
              <FaRegStar className="h-[40px] w-[38px] text-gray-400" />
            }
            onChange={(value) => setRating(value)}
          />
          {ratingError && <p className="text-sm text-red-400">{ratingError}</p>}

          <label className="block mt-5 mb-2 font-semibold" htmlFor="comment">
            Message
          </label>
          <textarea
            id="comment"
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full border border-gray-400 rounded-lg p-2 outline-none resize-none"
          ></textarea>

          <div className="w-full flex items-center text-sm justify-end space-x-3 mt-4">
            {sent && <span>Message sent, thank you!</span>}
            <Button
              onClick={sendFeedback}
              disabled={sent}
              className={clsx("flex items-center justify-center space-x-2", {
                "!bg-green-500 text-white": sent,
              })}
              aria-label="Send feedback"
            >
              <RiSendPlaneFill className="text-lg" />
              <span className="ml-2">Send</span>
            </Button>
          </div>
        </div>
      </Modal>

      <button
        onClick={() => setIsDetailsModalOpen(true)}
        className="px-1"
        aria-label="Open what is this modal"
      >
        What is this?
      </button>

      <RxDotFilled />

      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        className="px-1"
        aria-label="Open what is this modal"
      >
        Leave feedback
      </button>
    </footer>
  );
}
