interface CreatorContactProps {
  username: string;
  userID: string;
  chanID: string;
  url: string;
  isCreator: boolean;
  isAdmin: boolean;
  adminSection: boolean;
  isBanned: boolean;
}

export function CreatorContact({
  username,
  userID,
  chanID,
  url,
  isCreator,
  isAdmin,
  adminSection,
  isBanned
}: CreatorContactProps) {
  return (
    <>
      <div className="mx-2 my-1 flex flex-shrink-0 items-center justify-between p-3 text-left">
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture size="xs" url={url} />
          <p className="semibold max-w-[200px] break-all text-base text-pong-white">
            {username}
          </p>
        </div>
        <ButtonList
          userID={userID}
          chanID={chanID}
          isCreator={isCreator}
          isAdmin={isAdmin}
          adminSection={adminSection}
          isBanned={isBanned}
        />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
