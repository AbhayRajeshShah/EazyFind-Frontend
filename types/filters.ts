export interface Filters {
  minCost?: number;
  discount?: number;
  maxCost?: number;
  free?: boolean;
  rating?: number;
  area?: string;
  cuisineIds?: string[];
  mealtypeIds?: string[];
}

export interface BasicFilters {
  city?: string;
  name?: string;
}

export interface AllFilters extends Filters, BasicFilters {}
