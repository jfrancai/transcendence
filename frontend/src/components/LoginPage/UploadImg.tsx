import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate
} from 'react-router-dom';
import { useRef, useState } from 'react';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import IMAGES from '@img';
import { CONST_BACKEND_URL } from '@constant';
import ErrorPage from './ErrorPage';
import Header from './Header';

// I dont use action for this one because i couldn't find a way to handle file upload with action.
// It probably work i didn't find it, so i tried vanilla react.
export default function UploadImg() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNextClick = () => {
    navigate('/home');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50000) {
        setErrorMsg('Invalid size image should be under 20KB');
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`Invalid file type extension ${file.type}`);
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        return;
      }

      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const jwt = localStorage.getItem('jwt') as string;
    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt}` }
    };

    const result = await axios
      .post(`${CONST_BACKEND_URL}/img/upload`, formData, config)
      .then((response: AxiosResponse) => response.data)
      .catch((axiosError: AxiosError) => {
        if (axiosError.response) {
          const { message } = axiosError.response?.data as { message: string };
          setErrorMsg(message);
          setTimeout(() => {
            setErrorMsg(null);
          }, 5000);
        }
      });

    if (result) {
      navigate('/home');
    }
  };

  if (isRouteErrorResponse(error)) {
    return <ErrorPage />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <div className="flex w-[350px] flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-4 py-10">
        <Header name="Profile Picture" />
        {errorMsg && (
          <div className="mb-2 h-[40px] w-full rounded-[15px] border-none bg-blue-pong-3 p-2">
            <p className="text-center font-roboto text-[14px] font-bold text-red-500">
              {errorMsg}
            </p>
          </div>
        )}
        <label htmlFor="profile-upload">
          <div className="mb-2 mt-4">
            <button type="button" onClick={handleButtonClick}>
              {!image && !imagePreview && (
                <img
                  className="h-32 w-32 overflow-hidden rounded-full border-[1px] border-blue-pong-1 object-cover"
                  id="profile-upload"
                  src={IMAGES.upload}
                  alt="Upload"
                />
              )}
              {image && imagePreview && (
                <img
                  className="h-32 w-32 overflow-hidden rounded-full border-[1px] border-blue-pong-1 object-cover"
                  id="profile-preview"
                  src={imagePreview}
                  alt="ImagePreview"
                />
              )}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className="hidden"
              ref={fileInputRef}
              id="profile-upload"
              type="file"
              name="image"
              onChange={handleUpload}
            />
            {imagePreview !== null ? (
              <button
                className="custom-button custom-button-hover mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white hover:border-white"
                type="submit"
              >
                Submit
              </button>
            ) : (
              <button
                className="custom-button custom-button-hover mt-2 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white hover:border-white"
                type="button"
                onClick={handleNextClick}
              >
                Skip
              </button>
            )}
          </form>
        </label>
      </div>
    </div>
  );
}
