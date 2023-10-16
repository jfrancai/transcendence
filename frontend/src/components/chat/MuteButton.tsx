import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { useSocketContext } from '../../contexts/socket';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { useOutsideClick } from '../../utils/hooks/useOutsideClick';

interface TimePickerPopoverProps {
  userID: string;
  chanID: string;
  onClick: () => any;
  innerRef: any;
}

function TimePickerPopover({
  userID,
  chanID,
  onClick,
  innerRef
}: TimePickerPopoverProps) {
  const [selectedMuteTime, setSelectedMuteTime] = useState(30);
  const { socket } = useSocketContext();

  const handleChange = (e: any) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!Number.isNaN(inputValue) && inputValue >= 0) {
      setSelectedMuteTime(inputValue);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onClick();
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'MUTE',
      muteTime: selectedMuteTime,
      reason: 'You have been mute'
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      <div
        ref={innerRef}
        className="flex flex-col items-center gap-2 rounded-2xl bg-pong-blue-600 p-4 shadow-lg "
      >
        <p className="font-bold text-pong-white">Mute duration</p>
        <div className="mb-4">
          <select
            id="selector"
            value={selectedMuteTime}
            onChange={handleChange}
            className="w-full rounded-2xl border px-3 py-2 focus:border-blue-400 focus:outline-none focus:ring"
          >
            <option value="0">0 Seconds</option>
            <option value="30">30 Seconds</option>
            <option value="600">10 Minutes</option>
            <option value="3600">1 Hour</option>
          </select>
        </div>
        <PrimaryButton submit>Mute</PrimaryButton>
      </div>
    </form>
  );
}

interface MuteButtonProps {
  userID: string;
  chanID: string;
}

export function MuteButton({ userID, chanID }: MuteButtonProps) {
  const [toggleMute, setToggleMute] = useState(false);
  const clickOutsideMute = useOutsideClick(() => setToggleMute(false));
  return (
    <div role="presentation" onClick={() => setToggleMute(true)}>
      <BsFillVolumeMuteFill className="muteUser h-6 w-6 text-pong-blue-100" />
      <Tooltip
        disableStyleInjection
        className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
        anchorSelect=".muteUser"
        clickable
        place="bottom"
      >
        <p className="font-semibold">Mute user</p>
      </Tooltip>
      {toggleMute ? (
        <TimePickerPopover
          onClick={() => setToggleMute(false)}
          innerRef={clickOutsideMute}
          userID={userID}
          chanID={chanID}
        />
      ) : null}
    </div>
  );
}
