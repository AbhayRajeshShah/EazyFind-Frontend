export const objectToQueryParams = <T extends Record<string, any>>(
  o: T,
): string => {
  return Object.keys(o)
    .filter((key) => o[key] !== undefined && o[key] !== null && o[key] !== "")
    .map((key) => {
      let value: string = Array.isArray(o[key])
        ? parseArray(o[key])
        : encodeURIComponent(String(o[key]));
      console.log(value);
      return `${encodeURIComponent(key)}=${value}`;
    })
    .join("&");
};

const parseArray = (arr: string[] | number[]): string => {
  return arr.join(",");
};
