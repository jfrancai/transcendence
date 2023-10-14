import { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { SelectChannelType } from '../SelectChannelType/SelectChannelType';
import { Scrollable } from '../Scrollable/Scrollable';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import RenderIf from '../RenderIf/RenderIf';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return <p className="block text-sm font-bold text-pong-white">{title}</p>;
}

interface SectionProps {
  children: React.ReactNode;
}

function Section({ children }: SectionProps) {
  return <div className="flex w-full flex-col gap-1 px-5">{children}</div>;
}

interface CreateChannelViewProps {
  toggleInviteChannel: () => any;
  toggleChannelSettings: () => any;
  isNameView: boolean;
  chanID: string;
  setChanID: (arg: any) => any;
}

export function CreateChannelView({
  toggleInviteChannel,
  toggleChannelSettings,
  isNameView,
  chanID,
  setChanID
}: CreateChannelViewProps) {
  const { socket } = useSocketContext();
  const [chanName, setChanName] = useState(`${socket.username}'s channel`);
  const [type, setType] = useState<'PASSWORD' | 'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const channel = useChanInfo();

  useEffect(() => {
    const onChannelCreate = (data: any) => {
      setChanID(data.chanID);
    };
    socket.on('channelCreate', onChannelCreate);
    return () => {
      socket.off('channelCreate', onChannelCreate);
    };
  }, [socket, setChanID]);

  const handleCreateChannel = () => {
    socket.emit('channelCreate', {
      chanName,
      type,
      password
    });
    toggleChannelSettings();
  };

  useEffect(() => {
    if (!isNameView && chanID) {
      socket.emit('channelInfo', {
        chanID
      });
    }
  }, [chanID, isNameView, socket]);

  const handleUpdateChannel = () => {
    if (channel) {
      socket.emit('channelMode', {
        chanID,
        chanName: channel.chanName,
        type,
        password
      });
    }
  };

  useEffect(() => {
    const onError = (err: any) => {
      setError(err.message);
    };
    socket.on('channelCreate', toggleInviteChannel);
    socket.on('channelMode', toggleChannelSettings);
    socket.on('error', onError);
    return () => {
      socket.off('channelCreate', toggleInviteChannel);
      socket.off('channelMode', toggleChannelSettings);
      socket.off('error', onError);
    };
  }, [socket, toggleInviteChannel, toggleChannelSettings]);
  return (
    <>
      <Scrollable width={336}>
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <p className="text-2xl font-bold text-pong-white">
            {isNameView ? 'Create your Channel' : 'Update Channel'}
          </p>

          {isNameView ? (
            <>
              <Section>
                <SectionTitle title="CHANNEL PICTURE" />
                <label
                  htmlFor="UploadChannelImage"
                  className="flex justify-center rounded border border-dashed border-pong-white text-[50px]"
                >
                  <input
                    id="UploadChannelImage"
                    type="file"
                    className="hidden"
                  />
                  <AiOutlineCloudUpload className="my-4 cursor-pointer rounded-full bg-pong-blue-500 p-1 text-pong-blue-100" />
                </label>
              </Section>

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
            </>
          ) : null}
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
          <PrimaryButton
            onClick={isNameView ? handleCreateChannel : handleUpdateChannel}
          >
            {isNameView ? 'Create Channel' : 'Update Channel'}
          </PrimaryButton>
        </div>
      </Scrollable>
      <div className="h-14 w-[336px]" />
    </>
  );
}
