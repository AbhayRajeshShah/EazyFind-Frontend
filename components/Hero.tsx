"use client";
import { useState, useEffect } from "react";
import { City } from "@/types/city";
import { Restaurant } from "@/types/restaurant";
import { Search, MapPin } from "lucide-react";
import { API } from "@/api/config";
import Restaurants from "./Restaurants";

const Hero = ({
  cities,
  restaurants,
}: {
  cities: City[];
  restaurants: Restaurant[];
}) => {
  const [city, setCity] = useState(cities[0].city_name);
  const [refetch, setRefetch] = useState<Boolean>(false);
  const [listedRestaurants, setListedRestaurants] =
    useState<Restaurant[]>(restaurants);

  const updateCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCity((prevCity) => value);
    if (!refetch) {
      setRefetch(true);
    }
  };

  const getRestaurantByCity = async () => {
    try {
      let { data } = await API.get<Restaurant[]>(`/restaurants/${city}`);
      console.log(data);
      setListedRestaurants(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (refetch) {
      getRestaurantByCity();
    }
  }, [refetch, city]);

  return (
    <>
      <div className="flex px-12 pt-20 pb-12 m-auto text-center flex-col gap-8 items-center text-foreground justify-center flex-1">
        <h1 className="text-[52px] font-inter uppercase font-bold">
          Discover Your Next{" "}
          <span className="text-primary">Favorite Meal</span>{" "}
        </h1>
        <p className="font-inter text-[20px] text-gray-600 max-w-2xl">
          Find the best restaurants near you with exclusive offers and deals.
          Easy search, easy find.
        </p>
        <div className="m-auto p-4 w-full flex gap-4  bg-white rounded-lg">
          <div className="rounded-md flex-1 px-6 gap-6 flex items-center text-foreground bg-background">
            <Search />
            <input
              type="text"
              className="outline-none border-none py-4"
              placeholder="Search by restaurant..."
            />
          </div>
          <div className="rounded-md px-6 gap-2 flex items-center text-foreground bg-background">
            <MapPin />
            <select
              className="outline-none px-3 border-none py-4"
              value={city}
              onChange={updateCity}
            >
              <option value="">Select City</option>
              {cities.map((c, i) => {
                return (
                  <option value={c.city_name} key={c.id}>
                    {c.city_name}
                  </option>
                );
              })}
            </select>
          </div>
          <button className="px-6 cursor-pointer py-4 bg-primary rounded-md text-background">
            Search
          </button>
        </div>
      </div>
      <Restaurants restaurants={listedRestaurants} />
    </>
  );
};

export default Hero;
