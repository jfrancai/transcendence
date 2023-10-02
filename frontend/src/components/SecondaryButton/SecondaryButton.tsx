import { useState } from 'react';

interface SecondaryButtonProps {
  className?: string;
  span: string;
  disabled?: boolean;
  onClick?: () => any;
}

const styles = Object.freeze({
  default:
    'inline-flex items-center justify-center rounded-lg border border-solid border-pong-blue-100 bg-pong-blue-600 px-4 py-1 text-pong-white',
  clicked:
    'inline-flex items-center justify-center rounded-lg border border-solid border-pong-blue-100 bg-transparent px-4 py-1 text-pong-blue-100'
});

function SecondaryButton({
  className,
  span,
  disabled,
  onClick
}: SecondaryButtonProps) {
  const [style, setStyle] = useState<string>(styles.default);

  const handleMouseDown = () => {
    if (disabled === false) {
      setStyle(styles.clicked);
    }
  };

  const handleMouseUp = () => {
    if (disabled === false) {
      setStyle(styles.default);
    }
  };

  return (
    <button
      type="button"
      className={`${disabled ? styles.clicked : style} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      <span className="font-bold">{span}</span>
    </button>
  );
}

export default SecondaryButton;
