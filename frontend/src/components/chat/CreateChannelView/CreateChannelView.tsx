import axios, { AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';
import { FormEvent, useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { SelectChannelType } from '../SelectChannelType/SelectChannelType';
import { Scrollable } from '../Scrollable/Scrollable';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import RenderIf from '../RenderIf/RenderIf';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';
import { useStateContext } from '../../../contexts/state';

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
  chanID: string;
  setChanID: (arg: any) => any;
}

export function CreateChannelView({
  chanID,
  setChanID
}: CreateChannelViewProps) {
  const { socket } = useSocketContext();
  const { toggleChannelSettings, isChannelNameView, toggleInviteChannel } =
    useStateContext();
  const [chanName, setChanName] = useState(`${socket.username}'s channel`);
  const [type, setType] = useState<'PASSWORD' | 'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const channel = useChanInfo();

  useEffect(() => {
    const handleSubmit = (id: string, img: File | null) => {
      if (!img) return;
      const formData = new FormData();
      formData.append('image', img);

      const jwt = localStorage.getItem('jwt') as string;
      const config: AxiosRequestConfig = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${jwt}` }
      };

      axios
        .post(`${CONST_BACKEND_URL}/img/upload/${id}`, formData, config)
        .catch(() => {});
    };

    const onChannelCreate = (data: any) => {
      setChanID(data.chanID);
      handleSubmit(data.chanID, image);
    };
    socket.on('channelCreate', onChannelCreate);
    return () => {
      socket.off('channelCreate', onChannelCreate);
    };
  }, [socket, setChanID, image]);

  const handleCreateChannel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('channelCreate', {
      chanName,
      type,
      password
    });
    toggleChannelSettings();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50000) {
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        return;
      }

      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isChannelNameView && chanID) {
      socket.emit('channelInfo', {
        chanID
      });
    }
  }, [chanID, isChannelNameView, socket]);

  const handleUpdateChannel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <form
      onSubmit={isChannelNameView ? handleCreateChannel : handleUpdateChannel}
    >
      <Scrollable width={336}>
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <p className="text-2xl font-bold text-pong-white">
            {isChannelNameView ? 'Create your Channel' : 'Update Channel'}
          </p>

          {isChannelNameView ? (
            <>
              <Section>
                <SectionTitle title="CHANNEL PICTURE" />
                <label
                  htmlFor="UploadChannelImage"
                  className="flex justify-center rounded border border-dashed border-pong-white p-3 text-[50px]"
                >
                  <input
                    id="UploadChannelImage"
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  {image && imagePreview ? (
                    <img
                      className="h-24 w-24 cursor-pointer overflow-hidden rounded-full border-[1px] border-blue-pong-1 object-cover"
                      id="profile-preview"
                      src={imagePreview}
                      alt="ImagePreview"
                    />
                  ) : (
                    <AiOutlineCloudUpload className="my-4 cursor-pointer rounded-full bg-pong-blue-500 p-1 text-pong-blue-100" />
                  )}
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
          <PrimaryButton submit>
            {isChannelNameView ? 'Create Channel' : 'Update Channel'}
          </PrimaryButton>
        </div>
      </Scrollable>
      <div className="h-14 w-[336px]" />
    </form>
  );
}
