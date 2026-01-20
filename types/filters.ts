export interface Filters {
  minCost?: number;
  discount?: number;
  maxCost?: number;
  free?: boolean;
  rating?: number;
  area?: string;
}

export interface BasicFilters {
  city?: string;
  name?: string;
}
