import { useState } from 'react';
import RenderIf from '../RenderIf/RenderIf';
import { ContactListFeed } from '../ContactListFeed/ContactListFeed';
import { SendMessageInput } from '../SendMessageInput/SendMessageInput';
import { PrivateFeed } from '../PrivateFeed/PrivateFeed';
import { useStateContext } from '../../../contexts/state';

export function PrivateMessage() {
  const [userID, setUserID] = useState<string>('');
  const { isConversationView, isMessageView } = useStateContext();

  return (
    <>
      <RenderIf some={[isConversationView]}>
        <PrivateFeed userID={userID} event="messages" />
        <SendMessageInput receiverID={userID} event="privateMessage" />
      </RenderIf>
      <RenderIf some={[isMessageView]}>
        <ContactListFeed setUserID={setUserID} />
      </RenderIf>
    </>
  );
}
