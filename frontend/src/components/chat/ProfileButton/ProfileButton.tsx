import { useState } from 'react';

interface ProfileButtonProps {
  className: string;
}

const styles = Object.freeze({
  default:
    'inline-flex items-center justify-center rounded-lg border border-solid border-pong-blue-100 bg-pong-blue-600 px-4 py-1 text-pong-white',
  clicked:
    'inline-flex items-center justify-center rounded-lg border border-solid border-pong-blue-100 bg-transparent px-4 py-1 text-pong-blue-100'
});

function ProfileButton({ className }: ProfileButtonProps) {
  const [style, setStyle] = useState<string>(styles.default);

  const handleMouseDown = () => {
    setStyle(styles.clicked);
  };

  const handleMouseUp = () => {
    setStyle(styles.default);
  };

  return (
    <button
      type="button"
      className={`${style} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <span className="font-bold">See Profile</span>
    </button>
  );
}

export default ProfileButton;
