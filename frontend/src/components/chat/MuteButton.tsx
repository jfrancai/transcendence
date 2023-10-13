import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface MuteButtonProps {
  userID: string;
  chanID: string;
}

export function MuteButton({ userID, chanID }: MuteButtonProps) {
  const { socket } = useSocketContext();
  const muteUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'MUTE',
      reason: 'You have been mute'
    });
  };

  return (
    <AdminButton onClick={muteUser} anchorSelect="muteUser" info="Mute user">
      <BsFillVolumeMuteFill className="muteUser h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
