"use client";
import React, { useState, useEffect } from "react";
import { City } from "@/types/city";
import { Restaurant } from "@/types/restaurant";
import { Search, MapPin, LoaderCircle } from "lucide-react";
import { API } from "@/api/config";
import Restaurants from "./Restaurants";
import { objectToQueryParams } from "@/utils/URLEncoder";
import { SlidersHorizontal } from "lucide-react";
import FiltersSideBar from "./FiltersSideBar";
import { Filters, AllFilters } from "@/types/filters";
import { Cuisine } from "@/types/cuisine";
import { MealType } from "@/types/mealType";
import Pagination from "./Pagination";
import { updateUrlQuery, getQueryParams } from "@/utils/URLEncoder";

const Hero = ({
  cities,
  restaurants,
  mealTypes,
  cuisines,
  pages,
}: {
  cities: City[];
  restaurants: Restaurant[];
  mealTypes: MealType[];
  cuisines: Cuisine[];
  pages: number;
}) => {
  const [refetch, setRefetch] = useState<Boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(pages);
  const [currPage, setCurrPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [listedRestaurants, setListedRestaurants] =
    useState<Restaurant[]>(restaurants);

  const [filters, setFilters] = useState<AllFilters>({
    city: cities[0].city_name,
  });

  const handleFilterChange = () => {
    setRefetch(true);
  };

  const [toggleSideBar, setToggleSideBar] = useState<Boolean>(false);

  const updateBasicInputs = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const getRestaurants = async (additionalFilters: Filters = {}) => {
    setLoading(true);
    try {
      const query = { ...filters, ...additionalFilters, page: currPage };
      const { data } = await API.get<{
        restaurants: Restaurant[];
        pages: number;
      }>(`/restaurants?${objectToQueryParams(query)}`);
      setListedRestaurants(data.restaurants);
      setTotalPages(data.pages);
      updateUrlQuery(query);
    } catch (e) {}
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRefetch(true);
  };

  console.log(refetch);

  useEffect(() => {
    if (refetch) {
      getRestaurants();
      setRefetch(false);
    }
  }, [refetch, filters.city, currPage]);

  const resetFilters = () => {
    setFilters((f) => {
      return { city: f.city, name: f.name || "", minCost: 0, maxCost: 10000 };
    });
    setRefetch(true);
  };

  useEffect(() => {
    if (mealTypes.length == 0 && cuisines.length == 0) return;
    const queryParams = getQueryParams();
    setFilters((e) => {
      return {
        ...queryParams.filter,
        city: queryParams.filter.city || "delhi-ncr",
        name: "",
      };
    });
    setCurrPage(queryParams.page);
  }, [mealTypes, cuisines]);

  return (
    <div className="px-12">
      <div className="flex relative z-20 px-12 pt-20 pb-12 m-auto text-center flex-col gap-8 items-center text-foreground justify-center flex-1">
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
            value={filters.city}
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
              value={filters.name || ""}
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
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        )}
        <div className="relative">
          {/* content */}
          {loading && (
            <div className="fixed inset-0 bg-gray-50/50 z-10">
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoaderCircle className="animate-spin text-primary w-8 h-8" />
              </div>
            </div>
          )}

          <Restaurants restaurants={listedRestaurants} />
        </div>
      </div>
      <Pagination
        currPage={currPage}
        setCurrPage={(curr: number) => {
          if (!refetch) {
            setRefetch(true);
          }
          setCurrPage(curr);
        }}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Hero;
