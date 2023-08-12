import { BsFillHexagonFill } from 'react-icons/bs';

interface ProfilePictureProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  level?: number;
}

const style = Object.freeze({
  xs: {
    div: 'h-14 w-14 border-[1.2px]',
    dimension: 'h-[24px] w-[18px]',
    text: 'text-xs',
    position: 'bottom-[-11px]'
  },
  s: {
    div: 'h-20 w-20 border-[1.7px]',
    dimension: 'h-[30px] w-[24px]',
    text: 'text-sm',
    position: 'bottom-[-15px]'
  },
  m: {
    div: 'h-28 w-28 border-[2.5px]',
    dimension: 'h-[35px] w-[28px]',
    text: 'text-sm',
    position: 'bottom-[-20px]'
  },
  l: {
    div: 'h-32 w-32 border-[3.5px]',
    dimension: 'h-[40px] w-[32px]',
    text: 'text-lg',
    position: 'bottom-[-20px]'
  },
  xl: {
    div: 'h-40 w-40 border-[5px]',
    dimension: 'h-[48px] w-[40px]',
    text: 'text-xl',
    position: 'bottom-[-20px]'
  }
});

function ProfilePicture({ size = 'xl', level = 1 }: ProfilePictureProps) {
  return (
    <div
      className={`${style[size].div} w-flex-shrink-0 relative flex items-end justify-center rounded-full border-solid border-pong-purple bg-[url(/starwatcher.jpg)] bg-cover bg-no-repeat`}
    >
      <div className={`absolute ${style[size].position}`}>
        <div
          className={`flex ${style[size].dimension} items-center justify-center`}
        >
          <div className={`relative ${style[size].dimension}`}>
            <div
              className={`-rotate-30 absolute ${style[size].dimension} origin-center transform bg-pong-purple`}
              style={{
                clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            />
          </div>
          <div
            className={`absolute z-10 flex ${style[size].dimension} items-center justify-center bg-none`}
          >
            <span className={`${style[size].text} text-white`}>{level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePicture;
