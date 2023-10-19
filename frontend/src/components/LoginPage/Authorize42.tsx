import { CONST_AUTHORIZE_URL } from '@constant';
import IMAGES from '@img';

function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach((x) => (result += characters[x % charactersLength])); // eslint-disable-line
  return result;
}

export default function Authorize42() {
  return (
    <div>
      <a href={`${CONST_AUTHORIZE_URL}&state=${generateRandomString(32)}`}>
        <button
          className="custom-button custom-button-hover mt-4 flex h-[40px] w-full items-center justify-center rounded-[15px] border-[1px] border-blue-pong-1 bg-green-login px-6 py-1 font-roboto text-[14px] font-bold text-white"
          type="button"
        >
          <span className="pr-2">Authorized </span>
          <img src={IMAGES.logo_png} width="24" height="24" alt="42" />
        </button>
      </a>
    </div>
  );
}
