import { UserContext } from "common/contexts/User";
import { User } from "common/models/user";
import { getUserByToken } from "common/utils/apiService";
import React from "react";
import { useQuery } from "react-query";

export function useUser() {
  const { user, setUser } = React.useContext(UserContext);
  return {
    user,
    setUser,
    queryUser: useQuery<User, Error>("user", getUserByToken, {
      onSuccess: (data) => setUser(data),
      onError: () => setUser(),
    }),
  };
}
