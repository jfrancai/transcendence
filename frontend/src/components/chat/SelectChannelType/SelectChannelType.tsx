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
        onClick={() => setActive('public')}
        disabled={active !== 'public'}
        span="Public"
      />
      <SecondaryButton
        onClick={() => setActive('private')}
        disabled={active !== 'private'}
        span="Private"
      />
      <SecondaryButton
        onClick={() => setActive('protected')}
        disabled={active !== 'protected'}
        span="Protected"
      />
    </div>
  );
}
