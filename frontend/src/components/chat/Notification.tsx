import RenderIf from './RenderIf/RenderIf';
import { useStateContext } from '../../contexts/state';

export function Notification() {
  const { isNotificationView } = useStateContext();
  return (
    <RenderIf some={[isNotificationView]}>
      <p className="text-white">notificationView</p>
    </RenderIf>
  );
}
