export interface Restaurant {
  id: bigint;
  restaurant_name?: string;
  url?: string;
  city?: string;
  area?: string;
  cost_for_two?: number;
  rating?: string;
  page?: number;
  offer?: string;
  percentage?: string;
  effective_discount?: number;
  free?: boolean;
  latitude?: number;
  longitude?: number;
  geo?: unknown; // Unsupported("geography")
  geo_status?: "PENDING" | "ACTIVE" | "FAILED" | string;
  image_url?: string;
  restaurant_cuisines?: RestaurantCuisine[];
  restaurant_meal_types?: RestaurantMealType[];
}

export interface RestaurantCuisine {
  id: number;
  restaurant_id: bigint;
  cuisine: string;
}

export interface RestaurantMealType {
  id: number;
  restaurant_id: bigint;
  meal_type: string;
}

export interface RestaurantDTO {
  id: string;
  restaurant_name?: string;
  city?: string;
  area?: string;
  cost_for_two?: number;
  rating?: number;
  offer?: string;
  effective_discount?: number;
  free?: boolean;
  image_url?: string;
}
