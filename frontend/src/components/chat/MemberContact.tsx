import { useState } from 'react';
import { useOutsideClick } from '../../utils/hooks/useOutsideClick';
import { AddAdminButton } from './AddAdminButton';
import { BanButton } from './BanButton';
import { ChanContact } from './ChanContact/ChanContact';
import { KickButton } from './KickButton';
import { MuteButton } from './MuteButton';
import { useSocketContext } from '../../contexts/socket';

interface MemberContactProps {
  username: string;
  userID: string;
  chanID: string;
  displayButtons: boolean;
}

export function MemberContact({
  username,
  userID,
  chanID,
  displayButtons
}: MemberContactProps) {
  const [display, setDisplay] = useState(false);
  const ref = useOutsideClick(() => setDisplay(false));
  const buttons = () => (
    <>
      <AddAdminButton userID={userID} chanID={chanID} />
      <KickButton userID={userID} chanID={chanID} />
      <BanButton userID={userID} chanID={chanID} />
      <MuteButton userID={userID} chanID={chanID} />
    </>
  );
  return (
    <ChanContact
      innerRef={ref}
      onContextMenu={(e) => {
        e.preventDefault();
        setDisplay(true);
      }}
      key={userID}
      username={username}
      url="starwatcher.jpg"
      hideUsername={display && displayButtons}
    >
      {displayButtons && display ? buttons() : null}
    </ChanContact>
  );
}
