import { Tooltip } from 'react-tooltip';
import { useEffect } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { Scrollable } from '../Scrollable/Scrollable';
import { useChannels } from '../../../utils/hooks/useChannels';
import { useSocketContext } from '../../../contexts/socket';
import SecondaryButton from '../../SecondaryButton/SecondaryButton';

interface ChannelCarrouselCardProps {
  onClick: () => any;
  toggleChannelSettings: () => any;
  select: boolean;
  chanName: string;
  id: string;
}

export function ChannelCarrouselCard({
  onClick,
  select,
  chanName,
  toggleChannelSettings,
  id
}: ChannelCarrouselCardProps) {
  return (
    <div>
      <button type="button" onClick={onClick} className={`id-${id}`}>
        <ProfilePicture select={select} size="s" url="starwatcher.jpg" />
      </button>
    </div>
  );
}

interface ChannelCarrouselProps {
  toggleCreateChannelView: () => any;
  toggleChannelSettings: () => any;
  toggleChannelView: () => any;
  setChanID: (arg: string) => any;
  chanID: string;
}

export function ChannelCarrousel({
  toggleCreateChannelView,
  toggleChannelSettings,
  toggleChannelView,
  setChanID,
  chanID
}: ChannelCarrouselProps) {
  const { socket } = useSocketContext();
  const channels = useChannels();

  useEffect(() => {
    socket.emit('channels');
  }, [socket]);

  return (
    <Scrollable>
      <div className="t mt-28 min-h-[758px] w-16 rounded-2xl bg-pong-blue-500 pt-2">
        <div className="shrink-0 flex-col-reverse items-center justify-end">
          <div className="flex flex-col items-center justify-center gap-1">
            {channels.map((c) => (
              <ChannelCarrouselCard
                id={c.chanID}
                key={c.chanID}
                onClick={() => {
                  setChanID(c.chanID);
                  toggleChannelView();
                }}
                toggleChannelSettings={toggleChannelSettings}
                select={chanID === c.chanID}
                chanName={c.chanName}
              />
            ))}
            <div className="">
              <button type="button" onClick={toggleCreateChannelView}>
                <AiOutlinePlusCircle className="h-[50px] w-[50px] rounded-2xl text-pong-blue-100 hover:bg-pong-blue-100 hover:text-pong-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Scrollable>
  );
}
