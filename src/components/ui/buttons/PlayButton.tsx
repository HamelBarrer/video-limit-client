import { ReactNode } from 'react';

interface PlayButtonProps {
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const PlayButton = ({ handleClick, children }: PlayButtonProps) => {
  return (
    <button
      className="bg-green-600 text-white p-4 rounded-full duration-300 hover:bg-green-800 hover:scale-105 active:bg-green-900"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default PlayButton;
