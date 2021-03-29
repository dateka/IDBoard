import { useUser } from "common/hooks/useUser";
import React from "react";

const UserInfo = () => {
  const { user } = useUser();

  return (
    <p>
      {user?.firstname} {user?.lastname}
    </p>
  );
};

export default UserInfo;
