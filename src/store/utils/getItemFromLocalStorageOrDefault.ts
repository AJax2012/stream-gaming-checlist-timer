const getItemFromLocalStorageOrDefault = <T>(
  item: string,
  defaultValue: T
): T => {
  const value = localStorage.getItem(item);
  if (typeof defaultValue === 'string') {
    return value ? (value as T) : defaultValue;
  }
  return value ? JSON.parse(value) : defaultValue;
};

export default getItemFromLocalStorageOrDefault;
