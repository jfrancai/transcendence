import IMAGES from '@img';
import { Form } from 'react-router-dom';
import InputField from '@login/InputField';

export default function ModifyProfile(props: {
  option: boolean;
  setOption: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  handleClickClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { option, setOption, username, handleClickClose, handleUpload } = props;

  const handleSubmit = () => {
    setOption(false);
  };
  if (!option) return null;

  return (
    <div className="flex flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-6">
      <div className="grid grid-cols-10">
        <button
          type="button"
          onClick={handleClickClose}
          className="col-start-10 grid items-end justify-end pt-[0.25rem] text-right"
        >
          <img src={IMAGES.cross} width="16" height="16" alt="cross" />
        </button>
      </div>
      <Form
        method="post"
        encType="multipart/form-data"
        className="pb-4 pt-1"
        onSubmit={handleSubmit}
      >
        <InputField
          type="username"
          label="Username"
          placeholder={username}
          name="username"
        />
        <InputField type="password" label="Password" name="password" />
        <InputField type="password" label="Confirm Password" name="confirm" />
        <input name="hiddenInput" readOnly hidden value={username} />
        <div className="p-[1px]">
          <label
            className="font-roboto text-[15px] text-sm font-bold text-blue-pong-1"
            htmlFor="Profile Pictures"
          >
            Profile Pictures
            <br />
            <input
              className="text-sm text-white"
              type="file"
              name="pp"
              id="pp"
              onChange={handleUpload}
              multiple
            />
          </label>
          <button
            className="mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
