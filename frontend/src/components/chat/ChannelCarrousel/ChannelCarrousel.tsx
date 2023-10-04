import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { Scrollable } from '../Scrollable/Scrollable';
import { useChannels } from '../../../utils/hooks/useChannels';
import { useSocketContext } from '../../../contexts/socket';

interface ChannelCarrouselProps {
  toggleCreateChannelView: () => any;
  setChanName: (arg: string | undefined) => any;
}

export function ChannelCarrousel({
  toggleCreateChannelView,
  setChanName
}: ChannelCarrouselProps) {
  const { socket } = useSocketContext();
  const [selected, setSelected] = useState('');
  const channels = useChannels();

  useEffect(() => {
    socket.emit('channels');
  }, [socket]);

  return (
    <Scrollable>
      <div className="mt-28 w-16 rounded-2xl bg-pong-blue-500 pt-2">
        <Scrollable>
          <div className="flex flex-col items-center justify-center gap-3">
            {channels.map((c) => (
              <button
                key={c.chanID}
                type="button"
                onClick={() => {
                  setChanName(c.chanName);
                  setSelected(c.chanID);
                }}
              >
                <ProfilePicture
                  select={selected === c.chanID}
                  size="s"
                  url="starwatcher.jpg"
                />
              </button>
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
