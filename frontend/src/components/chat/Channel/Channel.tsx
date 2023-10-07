import { useState } from 'react';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import { ChannelCarrousel } from '../ChannelCarrousel/ChannelCarrousel';
import { ChannelListFeed } from '../ChannelListFeed.tsx/ChannelListFeed';
import { CreateChannelView } from '../CreateChannelView/CreateChannelView';
import RenderIf from '../RenderIf/RenderIf';
import { Scrollable } from '../Scrollable/Scrollable';
import { SendMessageInput } from '../SendMessageInput/SendMessageInput';
import ChatFeed from '../ChatFeed/ChatFeed';
import { JoinChannelView } from '../JoinChannelView/JoinChannelView';

interface ChannelProps {
  toggleChannelView: () => any;
  toggleCreateChannelView: () => any;
  toggleInviteChannel: () => any;
  toggleChannelSettings: () => any;
  createChannel: () => any;
  joinChannel: () => any;
  isChannelView: boolean;
  isCreateORJoinChannelView: boolean;
  isChannelSettings: boolean;
  isChannelNameView: boolean;
  isJoinChannelView: boolean;
}
export function Channel({
  toggleChannelView,
  toggleCreateChannelView,
  toggleInviteChannel,
  toggleChannelSettings,
  createChannel,
  joinChannel,
  isChannelView,
  isChannelSettings,
  isCreateORJoinChannelView,
  isChannelNameView,
  isJoinChannelView
}: ChannelProps) {
  const [chanID, setChanID] = useState<string>('');

  return (
    <>
      <div className="flex flex-row">
        <RenderIf some={[isChannelSettings]}>
          <ChannelCarrousel
            toggleCreateChannelView={toggleCreateChannelView}
            toggleChannelSettings={toggleChannelSettings}
            toggleChannelView={toggleChannelView}
            setChanID={setChanID}
            chanID={chanID}
          />
        </RenderIf>
        <RenderIf some={[isChannelSettings]}>
          <ChannelListFeed chanID={chanID} />
        </RenderIf>
        <RenderIf some={[isChannelView]}>
          <ChatFeed userID={chanID} event="channelMessages" />
        </RenderIf>
      </div>
      <RenderIf some={[isChannelView]}>
        <SendMessageInput receiverID={chanID} event="channelMessage" />
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
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
      </RenderIf>
      <RenderIf some={[isChannelNameView]}>
        <Scrollable width={336}>
          <CreateChannelView toggleInviteChannel={toggleInviteChannel} />
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
      <RenderIf some={[isJoinChannelView]}>
        <Scrollable width={336}>
          <JoinChannelView
            toggleChannelView={toggleChannelView}
            setChanID={setChanID}
            chanID={chanID}
          />
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
    </>
  );
}
