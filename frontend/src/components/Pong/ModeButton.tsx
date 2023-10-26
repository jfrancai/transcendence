import { usePongStateContext } from '../../contexts/pongState';
import RenderIf from '../chat/RenderIf/RenderIf';
import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';

export function ModeButtons() {
  const { CLASSIC_MODE, SPEED_MODE, isChoosingMode } = usePongStateContext();
  return (
    <RenderIf some={[isChoosingMode]}>
      <PongDiv>
        <BluePongButton onClick={CLASSIC_MODE}>
          Play Classic mode
        </BluePongButton>
        <BluePongButton onClick={SPEED_MODE}>Play Speed mode</BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}
