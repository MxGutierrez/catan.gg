import clsx from "clsx";
import { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import Modal from "react-modal";
import { HiX } from "react-icons/hi";

interface Props {
  className?: string;
}

export default function Footer({ className }: Props) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  return (
    <footer
      className={clsx(
        "flex items-center justify-center text-sm space-x-1",
        className
      )}
    >
      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={() => setIsDetailsModalOpen(false)}
        overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-80 z-40"
        className="w-[calc(100%-20px)] max-w-[800px] max-h-[calc(100vh-80px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl flex flex-col min-h-0"
        contentLabel="What is this?"
      >
        <div className="flex justify-end">
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="p-5 !pb-2"
          >
            <HiX className="text-2xl" />
          </button>
        </div>

        <div className="overflow-auto overscroll-contain mt-1 px-6 md:px-9 pb-8">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-5">
            What is this?
          </h2>
          <p>
            Catan, also known as Settlers of Catan, is a popular board game that
            has been enjoyed by millions of players worldwide. The game is all
            about building settlements, trading resources, and conquering
            territories. However, one of the challenges players face is creating
            a new board every time they play the game. This is where the Awesome
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
            application is lightweight making it a great tool for mobile
            devices.
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
              <span className="underline">Increases Replayability</span>: With
              the generator, players can generate as many new boards as they
              like, making each game unique and increasing replayability.
            </li>

            <li>
              <span className="underline">Increases Convenience</span>: Players
              can access the generator from any mobile or desktop device, at any
              time, making it convenient and accessible.
            </li>
          </ul>

          <p>
            So, whether you are a seasoned Catan player, just starting out, or
            playing with your family or friends, the Awesome Catan board
            generator is an excellent tool to enhance the experience.
          </p>
        </div>
      </Modal>

      <button
        onClick={() => setIsDetailsModalOpen(true)}
        className="px-2"
        aria-label="Open what is this modal"
      >
        What is this?
      </button>

      <RxDotFilled />

      <p>Leave feedback</p>
    </footer>
  );
}
