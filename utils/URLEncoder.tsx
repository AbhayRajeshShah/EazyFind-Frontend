export const objectToQueryParams = <T extends Record<string, any>>(
  o: T,
): string => {
  return Object.keys(o)
    .filter((key) => o[key] !== undefined && o[key] !== null && o[key] !== "")
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(o[key]))}`,
    )
    .join("&");
};
