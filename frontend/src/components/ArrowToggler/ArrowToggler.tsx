import { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

interface ArrowTogglerProps {
  /**
   * Arrow is facing up
   */
  up?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Toggle components
 */
function ArrowToggler({ up = false, onClick }: ArrowTogglerProps) {
  const [toggle, setToggle] = useState(up);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setToggle(!toggle);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-3 rounded-full border-2 border-solid border-blue-pong-100 bg-transparent p-1"
    >
      {toggle ? (
        <IoIosArrowDown className="text-white" />
      ) : (
        <IoIosArrowUp className="text-white" />
      )}
    </button>
  );
}

ArrowToggler.defaultProps = {
  up: false,
  onClick: () => undefined
};

export default ArrowToggler;
