import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { SelectChannelType } from '../SelectChannelType/SelectChannelType';
import socket from '../../../services/socket';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return <p className="block text-sm font-bold text-pong-white">{title}</p>;
}

export function CreateChannelView() {
  const [channelName, setChannelName] = useState(
    `${socket.username}'s channel`
  );
  const [channelType, setChannelType] = useState('public');
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 pt-28">
      <p className="text-2xl font-bold text-pong-white">Create your Channel</p>

      <div className="flex w-full flex-col px-5 ">
        <SectionTitle title="CHANNEL TYPE" />
        <label
          htmlFor="UploadChannelImage"
          className="mt-2 flex justify-center rounded border border-dashed border-pong-white text-[50px]"
        >
          <input id="UploadChannelImage" type="file" className="hidden" />
          <AiOutlineCloudUpload className="my-4 cursor-pointer rounded-full bg-pong-blue-500 p-1 text-pong-blue-100" />
        </label>
      </div>

      <div className="flex w-full flex-col px-5">
        <SectionTitle title="CHANNEL NAME" />
        <label htmlFor="ChannelName">
          <input
            type="email"
            id="ChannelName"
            className="mt-1 w-full rounded-md border border-pong-blue-100 bg-pong-blue-500 p-1 text-base text-pong-white"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </label>
      </div>

      <div className="flex w-full flex-col px-5 ">
        <SectionTitle title="CHANNEL TYPE" />
        <SelectChannelType active={channelType} setActive={setChannelType} />
      </div>
      <PrimaryButton>Create Channel</PrimaryButton>
    </div>
  );
}
