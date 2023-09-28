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
      className="flex flex-col items-center justify-center gap-3 rounded-full border-2 border-solid border-pong-blue-100 bg-transparent p-1"
    >
      {toggle ? (
        <IoIosArrowUp className="text-white" />
      ) : (
        <IoIosArrowDown className="text-white" />
      )}
    </button>
  );
}
export default ArrowToggler;
