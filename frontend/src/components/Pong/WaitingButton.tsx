import { usePongStateContext } from '../../contexts/pongState';
import RenderIf from '../chat/RenderIf/RenderIf';
import { BluePongButton, RedPongButton } from './PongButton';
import { PongDiv } from './PongDiv';

export function WaitingButton() {
  const { isClassicModeWaitingRoom, isSpeedModeWaitingRoom, CHANGE_MODE } =
    usePongStateContext();

  return (
    <RenderIf some={[isClassicModeWaitingRoom, isSpeedModeWaitingRoom]}>
      <PongDiv>
        <BluePongButton>Waiting...</BluePongButton>
        <RedPongButton onClick={CHANGE_MODE}>Change Mode</RedPongButton>
      </PongDiv>
    </RenderIf>
  );
}
