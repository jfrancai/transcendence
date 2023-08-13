interface ProfilePictureProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  level?: number;
  url: string;
}

const style = Object.freeze({
  xs: {
    div: 'h-[39px] w-[39px] border-[1.2px]',
    dimension: 'h-[24px] w-[18px]',
    text: 'text-xs',
    position: 'bottom-[-11px]'
  },
  s: {
    div: 'h-[55px] w-[55px] border-[1.7px]',
    dimension: 'h-[30px] w-[24px]',
    text: 'text-sm',
    position: 'bottom-[-15px]'
  },
  m: {
    div: 'h-[78px] w-[78px] border-[2.5px]',
    dimension: 'h-[35px] w-[28px]',
    text: 'text-sm',
    position: 'bottom-[-20px]'
  },
  l: {
    div: 'h-[110px] w-[110px] border-[3.5px]',
    dimension: 'h-[40px] w-[32px]',
    text: 'text-lg',
    position: 'bottom-[-20px]'
  },
  xl: {
    div: 'h-[155px] w-[155px] border-[5px]',
    dimension: 'h-[48px] w-[40px]',
    text: 'text-xl',
    position: 'bottom-[-20px]'
  }
});

function ProfilePicture({ size = 'xl', level = 1, url }: ProfilePictureProps) {
  const bg = `bg-[url(${url})`;
  return (
    <div
      className={`${style[size].div} w-flex-shrink-0 relative flex items-end justify-center rounded-full border-solid border-pong-purple ${bg}] bg-cover bg-no-repeat`}
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
