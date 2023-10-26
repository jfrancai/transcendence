import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

export function ReadyButton() {
  const { socket } = useSocketContext();
  const { isSpeedNotReady, isClassicNotReady, isClassicReady, isSpeedReady } =
    usePongStateContext();

  return (
    <RenderIf
      some={[isSpeedReady, isClassicReady, isClassicNotReady, isSpeedNotReady]}
    >
      <PongDiv>
        <BluePongButton
          onClick={
            isSpeedReady || isClassicReady
              ? () => socket.emit('playerNotReady')
              : () => socket.emit('playerReady')
          }
        >
          {isSpeedReady || isClassicReady ? 'Ready' : 'Not Ready'}
        </BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}
