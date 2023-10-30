import { usePongStateContext } from '../../contexts/pongState';
import RenderIf from '../chat/RenderIf/RenderIf';
import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';

export function PlayAgainButton() {
  const {
    isClassicMatchModeEnd,
    isSpeedModeMatchEnd,
    PLAY_AGAIN,
    CHANGE_MODE
  } = usePongStateContext();
  return (
    <RenderIf some={[isSpeedModeMatchEnd, isClassicMatchModeEnd]}>
      <PongDiv className="mt-56">
        <BluePongButton onClick={PLAY_AGAIN}>Play again !</BluePongButton>
        <BluePongButton onClick={CHANGE_MODE}>Change Mode ?</BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}
