import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { Scrollable } from '../Scrollable/Scrollable';
import { useChannels } from '../../../utils/hooks/useChannels';
import { useSocketContext } from '../../../contexts/socket';

interface ChannelCarrouselCardProps {
  onClick: () => any;
  select: boolean;
  chanName: string;
}

export function ChannelCarrouselCard({
  onClick,
  select,
  chanName
}: ChannelCarrouselCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <ProfilePicture select={select} size="s" url="starwatcher.jpg" />
      </button>
      {isHovering && (
        <div className="absolute left-16 z-50 mt-[-55px] rounded border border-pong-blue-100 bg-pong-blue-500 p-2 text-pong-white">
          {chanName}
        </div>
      )}
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

  useEffect(() => {
    if (channels.length) {
      setChanID(channels[0].chanID);
    }
  }, [channels, setChanID]);

  return (
    <Scrollable>
      <div className="mt-28 w-16 rounded-2xl bg-pong-blue-500 pt-2">
        <Scrollable>
          <div className="flex flex-col items-center justify-center gap-1">
            {channels.map((c) => (
              <ChannelCarrouselCard
                key={c.chanID}
                onClick={() => {
                  if (chanID !== c.chanID) {
                    setChanID(c.chanID);
                    toggleChannelView();
                  } else {
                    toggleChannelSettings();
                  }
                }}
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
        </Scrollable>
      </div>
    </Scrollable>
  );
}
