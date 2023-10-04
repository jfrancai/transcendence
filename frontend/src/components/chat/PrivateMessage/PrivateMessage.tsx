import { useState } from 'react';
import RenderIf from '../RenderIf/RenderIf';
import ChatFeed from '../ChatFeed/ChatFeed';
import SendMessageInput from '../SendMessageInput/SendMessageInput';
import { ContactListFeed } from '../ContactListFeed.tsx/ContactListFeed';

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
        <ChatFeed userID={userID} />
        <SendMessageInput receiverID={userID} />
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
