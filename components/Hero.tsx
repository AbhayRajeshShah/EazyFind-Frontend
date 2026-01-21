"use client";
import React, { useState, useEffect } from "react";
import { City } from "@/types/city";
import { Restaurant } from "@/types/restaurant";
import { Search, MapPin } from "lucide-react";
import { API } from "@/api/config";
import Restaurants from "./Restaurants";
import { BasicFilters } from "@/types/filters";
import { objectToQueryParams } from "@/utils/URLEncoder";
import { SlidersHorizontal } from "lucide-react";
import FiltersSideBar from "./FiltersSideBar";
import { Filters } from "@/types/filters";
import { Cuisine } from "@/types/cuisine";
import { MealType } from "@/types/mealType";

const Hero = ({
  cities,
  restaurants,
  mealTypes,
  cuisines,
}: {
  cities: City[];
  restaurants: Restaurant[];
  mealTypes: MealType[];
  cuisines: Cuisine[];
}) => {
  const [refetch, setRefetch] = useState<Boolean>(false);
  const [listedRestaurants, setListedRestaurants] =
    useState<Restaurant[]>(restaurants);

  const [basicFilters, setBasicFilters] = useState<BasicFilters>({
    city: cities[0].city_name,
    name: "",
  });

  const [toggleSideBar, setToggleSideBar] = useState<Boolean>(false);

  const updateBasicInputs = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBasicFilters((prev) => {
      return { ...prev, [name]: value };
    });
    if (!refetch) {
      setRefetch(true);
    }
  };

  const getRestaurants = async (additionalFilters: Filters = {}) => {
    try {
      const query = { ...basicFilters, ...additionalFilters };
      console.log(objectToQueryParams(query));
      const { data } = await API.get<Restaurant[]>(
        `/restaurants?${objectToQueryParams(query)}`,
      );
      setListedRestaurants(data);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRestaurants();
  };

  useEffect(() => {
    if (refetch) {
      getRestaurants();
    }
  }, [refetch, basicFilters.city]);

  const applyFilters = (sidebarFilters: Filters) => {
    getRestaurants(sidebarFilters);
  };

  return (
    <div className="px-12">
      <div className="flex px-12 pt-20 pb-12 m-auto text-center flex-col gap-8 items-center text-foreground justify-center flex-1">
        <h1 className="text-[52px] font-poppins uppercase font-bold">
          Discover Your Next{" "}
          <span className="text-primary">Favorite Meal.</span>
        </h1>
        <p className="font-inter text-[20px] text-gray-600 max-w-2xl">
          Find the best restaurants near you with exclusive offers and deals.
          Easy search, easy find.
        </p>
      </div>
      <div className="m-auto items-center z-20 sticky top-0 p-4 w-full flex gap-4  bg-white rounded-lg">
        <button
          onClick={() => {
            setToggleSideBar(!toggleSideBar);
          }}
          className="px-3 h-full py-3 cursor-pointer bg-primary text-background rounded-lg"
        >
          <SlidersHorizontal className="text-background" />
        </button>

        <div className="rounded-md px-6 gap-2 flex items-center text-foreground bg-background">
          <MapPin />
          <select
            className="outline-none px-3 border-none py-4"
            value={basicFilters.city}
            onChange={updateBasicInputs}
            name="city"
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
        <form onSubmit={handleSubmit} className="flex flex-1 gap-4">
          <div className="rounded-md flex-1 px-6 gap-6 flex items-center text-foreground bg-background">
            <Search />
            <input
              type="text"
              className="outline-none border-none py-4 flex-1"
              placeholder="Search by restaurant..."
              name="name"
              value={basicFilters.name}
              onChange={updateBasicInputs}
            />
          </div>
          <button className="px-6 cursor-pointer py-4 bg-primary rounded-md text-background">
            Search
          </button>
        </form>
      </div>
      <div className="flex transition-all duration-200 gap-6 relative py-6">
        {toggleSideBar && (
          <FiltersSideBar
            cuisines={cuisines}
            mealTypes={mealTypes}
            applyFilters={applyFilters}
          />
        )}
        <Restaurants restaurants={listedRestaurants} />
      </div>
    </div>
  );
};

export default Hero;
