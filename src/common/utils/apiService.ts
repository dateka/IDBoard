import { User } from "common/models/user";
import { LevelEnriched } from "common/models/level";
import { Role } from "common/models/role";
import { SourceCode } from "common/models/sourceCode";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "common/utils/localStorage";

// const apiEndpoint = "https://localhost:5001/api";
const apiEndpoint = "http://www.idboard.net:44001/api";

type AccessToken = {
  tokenString: string;
  expireAt: string;
};

type RefreshToken = {
  username: string;
  tokenString: string;
  expireAt: string;
};

type LoginResponse = {
  id: number;
  username: string;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  roles: Role[];
};

type AuthenticatedUser = {
  id: number;
  username: string;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  role: Role;
};

const USERNAME = "rael06@hotmail.fr";
const PASSWORD = "Password1234.";

function getDefaultConfig() {
  const defaultConfig = {
    method: "GET",
    headers: getHeaders(),
  };
  return defaultConfig;
}

function getToken(): string | undefined {
  return getLocalStorageItem<AuthenticatedUser>("authenticatedUser")
    ?.accessToken.tokenString;
}

function getAccessTokenExpirationDate(): Date {
  const authenticatedUser = getLocalStorageItem<AuthenticatedUser>(
    "authenticatedUser"
  );
  return authenticatedUser
    ? new Date(authenticatedUser.accessToken.expireAt)
    : new Date(0);
}

function getHeaders() {
  const token = getToken();
  return new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
}

function requestWithoutToken<T>(url: string, config = {}): Promise<T> {
  return fetch(url, { ...config }).then(async (res) => {
    if (res.status === 200 || res.status === 201) return res.json();
  });
}

export async function requestBase<T>(url: string, config = {}): Promise<T> {
  return fetch(url, { ...getDefaultConfig(), ...config }).then(async (res) => {
    if (res.status === 200 || res.status === 201) return res.json();
  });
}

export async function request<T>(url: string, config = {}): Promise<T> {
  const accessTokenExpirationDate = getAccessTokenExpirationDate();
  if (
    accessTokenExpirationDate &&
    accessTokenExpirationDate.getTime() < Date.now()
  ) {
    const authenticatedUser = await requestBase<AuthenticatedUser>(
      `${apiEndpoint}/accounts/refresh-token`
    );
    if (authenticatedUser) {
      setLocalStorageItem<AuthenticatedUser>(
        "authenticatedUser",
        authenticatedUser
      );
    }
  }
  return requestBase<T>(url, config);
}

export async function login(): Promise<void> {
  const loginResponse = await requestWithoutToken<LoginResponse>(
    `${apiEndpoint}/accounts/login`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    }
  );
  setLocalStorageItem<LoginResponse>("authenticatedUser", loginResponse);
}

export async function selectRole(roleId: number): Promise<AuthenticatedUser> {
  const authenticatedUser = await request<AuthenticatedUser>(
    `${apiEndpoint}/accounts/select-role`,
    {
      method: "POST",
      body: JSON.stringify({ id: roleId }),
    }
  );
  setLocalStorageItem<AuthenticatedUser>(
    "authenticatedUser",
    authenticatedUser
  );
  return authenticatedUser;
}

export const getUserById = (id: number): Promise<User> => {
  return request<User>(`${apiEndpoint}/users/get-by-id/${id}`);
};

export async function getUserByToken(): Promise<User> {
  return request<User>(`${apiEndpoint}/users/get-by-token`);
}

export const getLevels = (): Promise<LevelEnriched[]> => {
  return request<LevelEnriched[]>(`${apiEndpoint}/levels/enriched-levels`);
};

export const createSourceCode = (
  sourceCode: SourceCode
): Promise<SourceCode> => {
  return request<SourceCode>(`${apiEndpoint}/sourceCodes`, {
    method: "POST",
    body: JSON.stringify(sourceCode),
  });
};

export const updateSourceCode = (
  sourceCode: SourceCode
): Promise<SourceCode> => {
  return request<SourceCode>(`${apiEndpoint}/sourceCodes/${sourceCode.id}`, {
    method: "PUT",
    body: JSON.stringify(sourceCode),
  });
};

export const saveSourceCode = async (
  sourceCode: SourceCode
): Promise<SourceCode> => {
  return sourceCode.id > 0
    ? updateSourceCode(sourceCode)
    : createSourceCode(sourceCode);
};

export const deleteSourceCode = ({ id }: SourceCode): Promise<void> => {
  return request<void>(`${apiEndpoint}/sourceCodes/${id}`, {
    method: "DELETE",
  });
};

export const getSourceCodes = (): Promise<SourceCode[]> => {
  return request<SourceCode[]>(`${apiEndpoint}/sourceCodes`);
};
