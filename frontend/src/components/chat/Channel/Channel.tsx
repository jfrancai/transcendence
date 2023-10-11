import { useState } from 'react';
import { ChannelCarrousel } from '../ChannelCarrousel/ChannelCarrousel';
import { ChannelListFeed } from '../ChannelListFeed.tsx/ChannelListFeed';
import { CreateChannelView } from '../CreateChannelView/CreateChannelView';
import RenderIf from '../RenderIf/RenderIf';
import { Scrollable } from '../Scrollable/Scrollable';
import { SendMessageInput } from '../SendMessageInput/SendMessageInput';
import ChanFeed from '../ChatFeed/ChatFeed';
import { JoinChannelView } from '../JoinChannelView/JoinChannelView';
import { CreateChannelMenu } from '../CreateChannelMenu/CreateChannelMenu';

interface ChannelProps {
  toggleChannelView: () => any;
  toggleCreateChannelView: () => any;
  toggleInviteChannel: () => any;
  toggleChannelSettings: () => any;
  createChannel: () => any;
  updateChannel: () => any;
  joinChannel: () => any;
  isChannelView: boolean;
  isCreateORJoinChannelView: boolean;
  isChannelSettings: boolean;
  isChannelNameView: boolean;
  isJoinChannelView: boolean;
  isInviteChannelView: boolean;
  isChannelConfigView: boolean;
}
export function Channel({
  toggleChannelView,
  toggleCreateChannelView,
  toggleInviteChannel,
  toggleChannelSettings,
  createChannel,
  updateChannel,
  joinChannel,
  isChannelView,
  isChannelSettings,
  isChannelConfigView,
  isCreateORJoinChannelView,
  isChannelNameView,
  isJoinChannelView,
  isInviteChannelView
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
          <ChannelListFeed
            updateChannel={updateChannel}
            chanID={chanID}
            setChanID={setChanID}
          />
        </RenderIf>
        <RenderIf some={[isChannelView]}>
          <ChanFeed
            userID={chanID}
            event="channelMessages"
            toggleChannelSettings={toggleChannelSettings}
          />
        </RenderIf>
      </div>
      <RenderIf some={[isChannelView]}>
        <SendMessageInput receiverID={chanID} event="channelMessage" />
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
        <CreateChannelMenu
          createChannel={createChannel}
          joinChannel={joinChannel}
        />
      </RenderIf>
      <RenderIf some={[isChannelNameView, isChannelConfigView]}>
        <CreateChannelView
          isNameView={isChannelNameView}
          toggleInviteChannel={toggleInviteChannel}
          toggleChannelSettings={toggleChannelSettings}
          chanID={chanID}
          setChanID={setChanID}
        />
      </RenderIf>
      <RenderIf some={[isInviteChannelView]}>
        <>
          <Scrollable width={336}>coucou</Scrollable>
          <div className="h-14 w-[336px]" />
        </>
      </RenderIf>
      <RenderIf some={[isJoinChannelView]}>
        <Scrollable width={336}>
          <JoinChannelView
            toggleChannelView={toggleChannelView}
            setChanID={setChanID}
          />
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
    </>
  );
}
