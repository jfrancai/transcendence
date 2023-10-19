import { Form } from 'react-router-dom';
import IMAGES from '@img';
import InputField from '@login/InputField';

export default function ModifyProfile(props: {
  option: boolean;
  error: string | null;
  username: string;
  setOption: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { option, error, username, setOption, handleClickClose, handleUpload } =
    props;

  if (!option) return null;

  const handleSubmit = () => {
    setOption(false);
  };

  return (
    <div className="flex flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-6 shadow-none">
      <div className="grid grid-cols-10">
        <button
          type="button"
          onClick={handleClickClose}
          className="col-start-10 grid items-end justify-end pt-[0.25rem] text-right"
        >
          <img src={IMAGES.cross} width="16" height="16" alt="cross" />
        </button>
      </div>
      {error && (
        <div className="flex items-center justify-center rounded-[18px] border border-blue-pong-1 bg-blue-pong-3 py-4 shadow-none">
          <p className="font-roboto text-sm font-bold text-red-500">{error}</p>
        </div>
      )}
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
            className="custom-button custom-button-hover mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white hover:border-white"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
