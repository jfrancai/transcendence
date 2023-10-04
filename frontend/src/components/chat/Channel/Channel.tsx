import { useState } from 'react';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import { ChannelCarrousel } from '../ChannelCarrousel/ChannelCarrousel';
import { ChannelListFeed } from '../ChannelListFeed.tsx/ChannelListFeed';
import { CreateChannelView } from '../CreateChannelView/CreateChannelView';
import RenderIf from '../RenderIf/RenderIf';
import { Scrollable } from '../Scrollable/Scrollable';

interface ChannelProps {
  toggleCreateChannelView: () => any;
  toggleInviteChannel: () => any;
  toggleConversationView: () => any;
  createChannel: () => any;
  isChannelView: boolean;
  isCreateORJoinChannelView: boolean;
  isChannelNameView: boolean;
}
export function Channel({
  toggleCreateChannelView,
  toggleInviteChannel,
  toggleConversationView,
  createChannel,
  isChannelView,
  isCreateORJoinChannelView,
  isChannelNameView
}: ChannelProps) {
  const [chanID, setChanID] = useState<string>('');
  return (
    <>
      <RenderIf some={[isChannelView]}>
        <div className="flex flex-row">
          <ChannelCarrousel
            toggleCreateChannelView={toggleCreateChannelView}
            setChanID={setChanID}
            chanID={chanID}
          />
          <ChannelListFeed
            toggleConversationView={toggleConversationView}
            chanID={chanID}
          />
        </div>
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
        <Scrollable>
          <div className="flex w-full flex-col items-center justify-center gap-10 pt-28">
            <p className="text-2xl font-bold text-pong-white">
              Create your Channel
            </p>

            <PrimaryButton onClick={createChannel}>
              Create my own channel
            </PrimaryButton>
          </div>
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
      <RenderIf some={[isChannelNameView]}>
        <Scrollable>
          <CreateChannelView toggleInviteChannel={toggleInviteChannel} />
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
    </>
  );
}
