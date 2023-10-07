import { useEffect, useState } from 'react';
import { SelectChannelType } from '../SelectChannelType/SelectChannelType';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import RenderIf from '../RenderIf/RenderIf';
import { useSocketContext } from '../../../contexts/socket';
import { Section, SectionTitle } from '../Section';

interface JoinChannelViewProps {
  toggleChannelView: () => any;
  setChanID: (arg: string) => any;
}

export function JoinChannelView({
  toggleChannelView,
  setChanID
}: JoinChannelViewProps) {
  const { socket } = useSocketContext();
  const [chanName, setChanName] = useState(`${socket.username}'s channel`);
  const [type, setType] = useState<'PASSWORD' | 'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleJoinChannel = () => {
    socket.emit('channelId', {
      chanName,
      type,
      password
    });
  };

  useEffect(() => {
    const onError = (err: any) => {
      setError(err.message);
    };
    const onChannelJoin = () => {
      toggleChannelView();
    };
    const onChannelID = (data: string) => {
      setChanID(data);
      socket.emit('channelJoin', {
        chanID: data,
        chanName,
        type,
        password
      });
    };
    socket.on('channelId', onChannelID);
    socket.on('channelJoin', onChannelJoin);
    socket.on('error', onError);
    return () => {
      socket.off('channelId', onChannelID);
      socket.off('channelJoin', onChannelJoin);
      socket.off('error', onError);
    };
  }, [socket, toggleChannelView, setChanID, chanName, type, password]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <p className="text-2xl font-bold text-pong-white">Join Channel</p>

      <Section>
        <SectionTitle title="CHANNEL NAME" />
        <label htmlFor="ChannelName">
          <input
            type="text"
            id="ChannelName"
            className="w-full rounded-md border border-pong-blue-100 bg-pong-blue-500 p-1 text-base text-pong-white"
            value={chanName}
            onChange={(e) => setChanName(e.target.value)}
          />
        </label>
        {error ? <p className="text-red-500">{error}</p> : null}
      </Section>

      <Section>
        <SectionTitle title="CHANNEL TYPE" />
        <SelectChannelType active={type} setActive={setType} />
        <RenderIf some={[type === 'PUBLIC']}>
          <p className="mt-3 break-words text-sm text-pong-blue-100">
            * Every user of the server can join your channel.
          </p>
        </RenderIf>
        <RenderIf some={[type === 'PRIVATE']}>
          <p className="mt-3 break-words text-sm text-pong-blue-100">
            * Only users that were invited to your channel can join it.
          </p>
        </RenderIf>
        <RenderIf some={[type === 'PASSWORD']}>
          <p className="mt-3 break-words text-sm text-pong-blue-100">
            * Only users that knows the password can join your channel.
          </p>
        </RenderIf>
      </Section>
      <RenderIf some={[type === 'PASSWORD']}>
        <Section>
          <SectionTitle title="password" />
          <label htmlFor="ChannelPassword">
            <input
              type="password"
              id="ChannelPassword"
              className="w-full rounded-md border border-pong-blue-100 bg-pong-blue-500 p-1 text-base text-pong-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </Section>
      </RenderIf>
      <PrimaryButton onClick={handleJoinChannel}>Join Channel</PrimaryButton>
    </div>
  );
}
