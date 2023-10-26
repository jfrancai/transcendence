import { FaBan } from 'react-icons/fa';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface BanButtonProps {
  userID: string;
  chanID: string;
}

export function BanButton({ userID, chanID }: BanButtonProps) {
  const { socket } = useSocketContext();
  const banUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'BAN',
      reason: 'You have been ban'
    });
  };

  return (
    <AdminButton onClick={banUser} anchorSelect="banUser" info="Ban user">
      <FaBan className="banUser h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
