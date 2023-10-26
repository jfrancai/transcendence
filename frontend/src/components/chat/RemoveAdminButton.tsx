import { MdAdminPanelSettings } from 'react-icons/md';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface BanButtonProps {
  userID: string;
  chanID: string;
}

export function RemoveAdminButton({ userID, chanID }: BanButtonProps) {
  const { socket } = useSocketContext();

  const removeAdmin = () => {
    socket.emit('channelRemoveAdmin', {
      usersID: [userID],
      chanID
    });
  };

  return (
    <AdminButton
      onClick={removeAdmin}
      anchorSelect="removeAdmin"
      info="Remove admin"
    >
      <MdAdminPanelSettings className="removeAdmin h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
