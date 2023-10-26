import { useEffect } from 'react';
import { usePongStateContext } from '../../contexts/pongState';
import { useJoinParty } from '../../utils/hooks/useJoinParty';
import RenderIf from '../chat/RenderIf/RenderIf';
import { BluePongButton, RedPongButton } from './PongButton';
import { PongDiv } from './PongDiv';

export function WaitingButton() {
  const {
    isClassicModeWaitingRoom,
    isSpeedModeWaitingRoom,
    CHANGE_MODE,
    JOIN_PARTY_LOBBY
  } = usePongStateContext();
  const { hasJoinParty } = useJoinParty();

  useEffect(() => {
    if (hasJoinParty) {
      JOIN_PARTY_LOBBY();
    }
  }, [hasJoinParty, JOIN_PARTY_LOBBY]);

  return (
    <RenderIf some={[isClassicModeWaitingRoom, isSpeedModeWaitingRoom]}>
      <PongDiv>
        <BluePongButton>Waiting...</BluePongButton>
        <RedPongButton onClick={CHANGE_MODE}>Change Mode</RedPongButton>
      </PongDiv>
    </RenderIf>
  );
}
