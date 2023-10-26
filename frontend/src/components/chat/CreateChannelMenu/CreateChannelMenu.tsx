import { useStateContext } from '../../../contexts/state';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import { Scrollable } from '../Scrollable/Scrollable';

export function CreateChannelMenu() {
  const { createChannel, joinChannel } = useStateContext();
  return (
    <>
      <Scrollable width={336}>
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <p className="text-2xl font-bold text-pong-white">
            Create your Channel
          </p>

          <div className="font-bold text-pong-white">
            <PrimaryButton onClick={createChannel}>
              Create my own channel
            </PrimaryButton>
          </div>
          <p className="text-pong-white">OR</p>
          <div className="text-pong-white">
            <button onClick={joinChannel} className="underline" type="button">
              Join a Channel
            </button>
          </div>
        </div>
      </Scrollable>
      <div className="h-14 w-[336px]" />
    </>
  );
}
