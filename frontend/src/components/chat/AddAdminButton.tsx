import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { AdminButton } from './AdminButton';
import { useSocketContext } from '../../contexts/socket';

interface BanButtonProps {
  userID: string;
  chanID: string;
}

export function AddAdminButton({ userID, chanID }: BanButtonProps) {
  const { socket } = useSocketContext();
  const addAdmin = () => {
    socket.emit('channelAddAdmin', {
      usersID: [userID],
      chanID
    });
  };

  return (
    <AdminButton onClick={addAdmin} anchorSelect="addAdmin" info="Add Admin">
      <MdOutlineAdminPanelSettings className="addAdmin h-6 w-6 text-pong-blue-100" />
    </AdminButton>
  );
}
