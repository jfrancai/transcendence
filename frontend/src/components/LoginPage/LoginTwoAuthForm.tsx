import { useState, useEffect } from 'react';
import { Form, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { isAxiosError } from 'axios';
import Header from './Header';
import InputField from './InputField';
import { isError } from '../../utils/functions/isError';

export default function LoginTwoAuthForm() {
  const error = useRouteError();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  let errorCode: string = '';

  useEffect(() => {
    if (isError(error)) {
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    } else if (isAxiosError(error)) {
      const { response } = error;
      setErrorMsg(response?.data.message!);
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    }
  }, [error]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedInput = /[0-9]/;

    // only allowed input could be type or backspace
    if (!allowedInput.test(e.key) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  if (isRouteErrorResponse(error)) {
    const errorMessage = error.data?.message;
    errorCode = error.status.toString(10);
    return (
      <div className="flex h-screen items-center justify-center bg-default bg-cover">
        <div className="flex flex-grow-0 flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
          <h1 className="flex-grow break-keep pb-[1.5px] font-roboto text-[38px] font-bold text-red-500">
            Error
            {` ${errorCode}`}
          </h1>
          <p className="whitespace-nowrap break-keep pt-[1.5px] font-roboto text-[18px] font-bold text-red-500">
            Oops an error as occurred:
            {` ${errorMessage}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-default bg-cover">
      <div className="flex grid-cols-1 flex-col items-center justify-center divide-y-[1px] rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
        <Header name="Login" />
        {errorMsg && (
          <div className="m-2 h-[40px] w-full rounded-[15px] border-blue-pong-3 bg-blue-pong-3 p-2">
            <p className="text-center font-roboto text-[14px] font-bold text-red-500">
              {errorMsg}
            </p>
          </div>
        )}
        <Form method="post" className="pt-4">
          <InputField type="username" label="Username" />
          <InputField type="password" label="Password" />
          <InputField
            type="text"
            label="Code Validation"
            name="twoFactorAuthCode"
            handleInput={handleKeyPress}
          />
          <button
            className="custom-button custom-button-hover mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white hover:border-white"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
