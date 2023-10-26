import { AddAdminButton } from './AddAdminButton';
import { RemoveAdminButton } from './RemoveAdminButton';

interface ToggleAdminProps {
  toggle: boolean;
  userID: string;
  chanID: string;
}

export function ToggleAdmin({ toggle, userID, chanID }: ToggleAdminProps) {
  if (toggle) {
    return <RemoveAdminButton userID={userID} chanID={chanID} />;
  }
  return <AddAdminButton userID={userID} chanID={chanID} />;
}
