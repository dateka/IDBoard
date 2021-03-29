import { useUser } from "common/hooks/useUser";
import { getUserByToken, login, selectRole } from "common/utils/apiService";
import React from "react";

export default function Login() {
  const { setUser } = useUser();

  return (
    <div>
      <h1>LOGIN</h1>
      <button
        onClick={async () => {
          await login();
          await selectRole(3);
          const user = await getUserByToken();
          setUser(user);
        }}
      >
        login
      </button>
    </div>
  );
}
