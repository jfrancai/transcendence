import { GiBootKick } from 'react-icons/gi';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface KickButtonProps {
  userID: string;
  chanID: string;
}

export function KickButton({ userID, chanID }: KickButtonProps) {
  const { socket } = useSocketContext();
  const kickUser = () => {
    socket.emit('channelRestrict', {
      userID,
      chanID,
      restrictType: 'KICK',
      reason: 'You have been kick'
    });
  };

  return (
    <AdminButton onClick={kickUser} anchorSelect="kickUser" info="Kick user">
      <GiBootKick className="kickUser h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
