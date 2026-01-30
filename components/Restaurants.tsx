import React from "react";
import { Restaurant } from "@/types/restaurant";
import { Star, Users, ExternalLink } from "lucide-react";

const Restaurants = ({ restaurants }: { restaurants: Restaurant[] }) => {
  return restaurants.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id.toString()}
          restaurant={restaurant}
        />
      ))}
    </div>
  ) : (
    <div className="flex w-full justify-center">
      <img src={"no_results.svg"} className="h-60 object-fit" />
    </div>
  );
};

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <div
      data-testid="restaurant-item"
      className="rounded-lg restaurant-item relative restaurant bg-olive shadow-md flex flex-col font-poppins"
    >
      <a
        href={`${restaurant.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-0 right-0 h-8 w-8 rounded-b-lg rounded-tl-lg bg-white text-black flex justify-center items-center"
      >
        <ExternalLink className="w-4" />
      </a>
      <img
        src={restaurant.image_url || "/placeholder-restaurant.png"}
        alt={restaurant.restaurant_name || "Restaurant Image"}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <div className="p-4 flex  flex-1 flex-col justify-between">
        {restaurant.distance_meters &&
          Math.round(restaurant.distance_meters / 1000) < 100 && (
            <p className="text-xs pb-2">
              {Math.round(restaurant.distance_meters / 1000)} km
            </p>
          )}

        <div className=" flex gap-1">
          <div className="flex flex-col flex-3">
            <h2 className="text-xl col-span-3 font-bold mb-2 font-inter">
              {restaurant.restaurant_name || "Unnamed Restaurant"}
            </h2>
            <p className="text-gray-600 col-span-3 mb-2 text-sm">
              {restaurant.area}, {restaurant.city}
            </p>
          </div>

          <div className="flex gap-1 justify-end">
            <Users className="w-4" />
            <p className="text-gray-800 text-right mb-2">
              ₹{restaurant.cost_for_two || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="rounded-md font-semibold border-accent border text-accent px-3 py-1 text-sm">
            {restaurant.offer}
          </div>
          <div className="flex gap-1 items-center justify-end text-primary">
            <Star className="w-4" />
            <p className="text-sm text-right">{restaurant.rating || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
