interface ProfilePictureProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  url: string;
}

const style = Object.freeze({
  xs: 'h-[39px] w-[39px] border-[1.2px]',
  s: 'h-[50px] w-[50px] border-[1.7px]',
  m: 'h-[78px] w-[78px] border-[2.5px]',
  l: 'h-[110px] w-[110px] border-[3.5px]',
  xl: 'h-[155px] w-[155px] border-[5px]'
});

function ProfilePicture({ size = 'xl', url }: ProfilePictureProps) {
  return (
    <div
      style={{ backgroundImage: `url(${url})` }}
      className={`min-w-fit ${style[size]} w-flex-shrink-0 relative flex items-end justify-center rounded-full border-solid border-pong-purple bg-cover bg-no-repeat`}
    />
  );
}

export default ProfilePicture;
