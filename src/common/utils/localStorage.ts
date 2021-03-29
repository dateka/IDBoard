export function getLocalStorageItem<T>(key: string): T | undefined {
  const dataString = window.localStorage.getItem(key);
  if (!dataString) return undefined;

  const data = JSON.parse(dataString) as T;
  return data;
}

export function setLocalStorageItem<T>(key: string, data: T) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key);
}
