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
  distance_meters?: number;
}
