import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string = '';
  let errorCode: string = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message;
    errorCode = error.status.toString(10);
  }

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
