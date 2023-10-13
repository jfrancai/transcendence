import { ChanContact } from './ChanContact/ChanContact';
import { UnbanButton } from './UnbanButton';

interface BannedContactProps {
  userID: string;
  username: string;
  chanID: string;
}

export function BannedContact({
  userID,
  username,
  chanID
}: BannedContactProps) {
  return (
    <ChanContact key={userID} username={username} url="starwatcher.jpg">
      <UnbanButton userID={userID} chanID={chanID} />
    </ChanContact>
  );
}
