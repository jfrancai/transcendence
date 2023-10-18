import { Tooltip } from 'react-tooltip';
import { useEffect } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Scrollable } from '../Scrollable/Scrollable';
import { useChannels } from '../../../utils/hooks/useChannels';
import { useSocketContext } from '../../../contexts/socket';
import { ChanPicture } from '../ChanPicture';
import { useStateContext } from '../../../contexts/state';

interface ChannelCarrouselCardProps {
  onPrimaryClick: () => any;
  onSecondaryClick: () => any;
  select: boolean;
  chanName: string;
  id: string;
}

export function ChannelCarrouselCard({
  onPrimaryClick,
  onSecondaryClick,
  select,
  chanName,
  id
}: ChannelCarrouselCardProps) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onSecondaryClick();
      }}
    >
      <button type="button" onClick={onPrimaryClick} className={`id-${id}`}>
        <ChanPicture select={select} size="s" chanID={id} />
      </button>
      <Tooltip
        disableStyleInjection
        className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
        anchorSelect={`.id-${id}`}
        clickable
        place="right"
      >
        <p className="font-semibold">{chanName}</p>
      </Tooltip>
    </div>
  );
}

interface ChannelCarrouselProps {
  setChanID: (arg: string) => any;
  chanID: string;
}

export function ChannelCarrousel({ setChanID, chanID }: ChannelCarrouselProps) {
  const { socket } = useSocketContext();
  const channels = useChannels(setChanID, chanID);
  const { toggleChannelView, toggleChannelSettings, toggleCreateChannelView } =
    useStateContext();

  useEffect(() => {
    const onChannelUserJoin = () => {
      socket.emit('channels');
    };
    onChannelUserJoin();
    socket.on('channelUserJoin', onChannelUserJoin);
    return () => {
      socket.off('channelUserJoin', onChannelUserJoin);
    };
  }, [socket]);

  return (
    <Scrollable>
      <div className="min-h-[758px] w-16 rounded-2xl bg-pong-blue-500 pt-2">
        <div className="flex flex-col items-center justify-center gap-1">
          {channels.map((c) => (
            <ChannelCarrouselCard
              id={c.chanID}
              key={c.chanID}
              onPrimaryClick={() => {
                setChanID(c.chanID);
                toggleChannelView();
              }}
              onSecondaryClick={() => {
                setChanID(c.chanID);
                toggleChannelSettings();
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
      </div>
    </Scrollable>
  );
}
