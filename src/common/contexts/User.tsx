import { User } from "common/models/user";
import React from "react";

type UserContextType = {
  user: User | undefined;
  setUser: (user?: User) => void;
};

export const UserContext = React.createContext<UserContextType>({
  user: undefined,
  setUser: (user?: User): void => {},
});

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<User>();

  return (
    <UserContext.Provider
      value={{ user, setUser }}
      {...props}
    ></UserContext.Provider>
  );
};
