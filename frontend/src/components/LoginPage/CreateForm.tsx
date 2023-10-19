import { useState, useEffect } from 'react';
import { Form, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import InputField from './InputField';
import Header from './Header';
import { isError } from '../../utils/functions/isError';

export default function CreateForm() {
  const error = useRouteError();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  let errorCode: string = '';

  useEffect(() => {
    if (isError(error)) {
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    }
  }, [error]);

  if (isRouteErrorResponse(error)) {
    const errorMessage = error.data.message;
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
        <Header name="Sign Up" />
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
          <InputField type="password" label="Confirm Password" name="confirm" />
          <InputField type="checkbox" label="Two Authenticator" name="twofa" />
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
