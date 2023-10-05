import { useState } from 'react';
import RenderIf from '../RenderIf/RenderIf';
import ChatFeed from '../ChatFeed/ChatFeed';
import { ContactListFeed } from '../ContactListFeed.tsx/ContactListFeed';
import { SendMessageInput } from '../SendMessageInput/SendMessageInput';

interface PrivateMessageProps {
  isMessageView: boolean;
  isConversationView: boolean;
  toggleConversationView: () => any;
}

export function PrivateMessage({
  isMessageView,
  isConversationView,
  toggleConversationView
}: PrivateMessageProps) {
  const [userID, setUserID] = useState<string>('');

  return (
    <>
      <RenderIf some={[isConversationView]}>
        <ChatFeed userID={userID} event="messages" />
        <SendMessageInput receiverID={userID} event="privateMessage" />
      </RenderIf>
      <RenderIf some={[isMessageView]}>
        <ContactListFeed
          setUserID={setUserID}
          toggleConversationView={toggleConversationView}
        />
      </RenderIf>
    </>
  );
}
