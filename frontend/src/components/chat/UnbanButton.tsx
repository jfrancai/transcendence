import { AiFillLock } from 'react-icons/ai';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface UnbanButtonProps {
  userID: string;
  chanID: string;
}

export function UnbanButton({ userID, chanID }: UnbanButtonProps) {
  const { socket } = useSocketContext();
  const unbanUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'UNBAN',
      reason: 'You have been unban'
    });
  };

  return (
    <AdminButton onClick={unbanUser} anchorSelect="unbanUser" info="Unban user">
      <AiFillLock className="unbanUser h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
