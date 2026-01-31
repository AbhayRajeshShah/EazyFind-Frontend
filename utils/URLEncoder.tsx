import { AllFilters } from "@/types/filters";

// ----------------- Helper to get search params for backend query ---------------------

export const objectToQueryParams = <T extends Record<string, any>>(
  o: T,
): string => {
  return Object.keys(o)
    .filter((key) => o[key] !== undefined && o[key] !== null && o[key] !== "")
    .map((key) => {
      let value: string = Array.isArray(o[key])
        ? parseArray(o[key])
        : encodeURIComponent(String(o[key]));
      return `${encodeURIComponent(key)}=${value}`;
    })
    .join("&");
};

const parseArray = (arr: string[] | number[]): string => {
  return arr.join(",");
};

// ----------------- Update Next.JS Browser search params with filter ---------------

export const updateUrlQuery = (newQuery = {}) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  Object.entries(newQuery).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      params.delete(key);
    } else {
      let s: string = String(value);
      if (Array.isArray(value)) {
        console.log(key);
        s = value.join(",");
      }
      params.set(key, s);
    }
  });

  const newUrl = `${url.pathname}?${params}`;
  window.history.pushState({}, "", newUrl);
};

// ---------------- Parse filters from URLSearch Params --------------------

function parseFilters(params: URLSearchParams): AllFilters {
  let obj: Record<string, any> = {
    city: params.get("city") || undefined,
    name: params.get("name") || undefined,
    minCost: params.get("minCost") ? Number(params.get("minCost")) : undefined,
    maxCost: params.get("maxCost") ? Number(params.get("maxCost")) : undefined,
    cuisineIds: params.get("cuisineIds")
      ? params.get("cuisineIds")!.split(",")
      : undefined,
    discount: params.get("discount")
      ? Number(params.get("discount"))
      : undefined,
    free: params.get("free") ? params.get("free") === "true" : undefined,
    rating: params.get("rating") ? Number(params.get("rating")) : undefined,
    area: params.get("area") || undefined,
    mealtypeIds: params.get("mealtypeIds")
      ? params.get("mealtypeIds")!.split(",")
      : undefined,
  };
  Object.keys(obj).map((e: string) => {
    if (obj[e] === undefined) {
      delete obj[e];
    }
  });
  return obj;
}

export const getQueryParams = (): { filter: AllFilters; page: number } => {
  const params = new URLSearchParams(window.location.search);
  const filters: AllFilters = parseFilters(params);
  const page: number = params.get("page")
    ? parseInt(String(params.get("page")))
    : 0;
  return { filter: filters, page: page };
};
