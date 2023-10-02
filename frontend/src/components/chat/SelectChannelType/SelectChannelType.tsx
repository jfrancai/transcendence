import SecondaryButton from '../../SecondaryButton/SecondaryButton';

interface SelectChannelTypeProps {
  active: any;
  setActive: (arg: any) => any;
}

export function SelectChannelType({
  active,
  setActive
}: SelectChannelTypeProps) {
  return (
    <div className="flex gap-2">
      <SecondaryButton
        onClick={() => setActive('PUBLIC')}
        disabled={active !== 'PUBLIC'}
        span="Public"
      />
      <SecondaryButton
        onClick={() => setActive('PRIVATE')}
        disabled={active !== 'PRIVATE'}
        span="Private"
      />
      <SecondaryButton
        onClick={() => setActive('PASSWORD')}
        disabled={active !== 'PASSWORD'}
        span="Protected"
      />
    </div>
  );
}
