import { BiMessageDetail } from 'react-icons/bi';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ContactCardProps {
  setContact: () => any;
  toggleConversationView: () => any;
  noBgColor?: boolean;
  userID: string;
  username: string;
  url: string;
}

export function ContactCard({
  setContact,
  toggleConversationView,
  userID,
  username,
  noBgColor,
  url
}: ContactCardProps) {
  return (
    <>
      <div
        className={`mx-2 my-1 flex flex-shrink-0 cursor-pointer items-center justify-between ${
          noBgColor ? 'bg-pong-blue-400' : ''
        } p-3 text-left`}
        role="presentation"
        key={userID}
        onClick={() => {
          setContact();
          toggleConversationView();
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture size="xs" url={url} />
          <p className="semibold max-w-[200px] break-all text-base text-pong-white">
            {username}
          </p>
        </div>
        <BiMessageDetail className="h-6 w-6 text-pong-blue-100 " />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
