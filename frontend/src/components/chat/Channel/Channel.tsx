import { useState } from 'react';
import { ChannelCarrousel } from '../ChannelCarrousel/ChannelCarrousel';
import { ChannelListFeed } from '../ChannelListFeed/ChannelListFeed';
import { CreateChannelView } from '../CreateChannelView/CreateChannelView';
import RenderIf from '../RenderIf/RenderIf';
import { SendMessageInput } from '../SendMessageInput/SendMessageInput';
import ChanFeed from '../ChatFeed/ChatFeed';
import { JoinChannelView } from '../JoinChannelView/JoinChannelView';
import { CreateChannelMenu } from '../CreateChannelMenu/CreateChannelMenu';
import { InviteChannelView } from '../InviteChannelView';
import { useStateContext } from '../../../contexts/state';

export function Channel() {
  const [chanID, setChanID] = useState<string>('');
  const {
    isChannelSettings,
    isChannelView,
    isCreateORJoinChannelView,
    isChannelConfigView,
    isChannelNameView,
    isInviteChannelView,
    isJoinChannelView
  } = useStateContext();

  return (
    <>
      <div className="flex flex-row">
        <RenderIf some={[isChannelSettings]}>
          <ChannelCarrousel setChanID={setChanID} chanID={chanID} />
          <ChannelListFeed chanID={chanID} setChanID={setChanID} />
        </RenderIf>
        <RenderIf some={[isChannelView]}>
          <ChanFeed userID={chanID} event="channelMessages" />
        </RenderIf>
      </div>
      <RenderIf some={[isChannelView]}>
        <SendMessageInput receiverID={chanID} event="channelMessage" />
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
        <CreateChannelMenu />
      </RenderIf>
      <RenderIf some={[isChannelNameView, isChannelConfigView]}>
        <CreateChannelView chanID={chanID} setChanID={setChanID} />
      </RenderIf>
      <RenderIf some={[isInviteChannelView]}>
        <InviteChannelView chanID={chanID} />
      </RenderIf>
      <RenderIf some={[isJoinChannelView]}>
        <JoinChannelView setChanID={setChanID} />
      </RenderIf>
    </>
  );
}
