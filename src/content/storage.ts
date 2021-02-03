export function setItem<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) =>
    chrome.storage.local.set({ [key]: JSON.stringify(value) }, resolve),
  )
}

export function getItem<T>(key: string): Promise<T> {
  return new Promise((resolve) =>
    chrome.storage.local.get(key, (result) =>
      resolve(key in result ? JSON.parse(result[key]) : undefined),
    ),
  )
}
