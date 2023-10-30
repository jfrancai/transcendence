import { usePongStateContext } from '../../contexts/pongState';
import RenderIf from '../chat/RenderIf/RenderIf';
import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';

export function ModeButtons() {
  const { CLASSIC_MODE, SPEED_MODE, isChoosingMode } = usePongStateContext();
  const text = "Let's Pong";
  return (
    <RenderIf some={[isChoosingMode]}>
      <PongDiv>
        <p className="mb-5 text-3xl font-bold text-pong-white">{text}</p>
        <BluePongButton onClick={CLASSIC_MODE}>Classic mode</BluePongButton>
        <BluePongButton onClick={SPEED_MODE}>Speed mode</BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}
