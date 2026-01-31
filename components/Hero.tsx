"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { City } from "@/types/city";
import { Restaurant } from "@/types/restaurant";
import { Search, MapPin, LoaderCircle, FunnelPlus } from "lucide-react";
import { API } from "@/api/config";
import Restaurants from "./Restaurants";
import {
  objectToQueryParams,
  updateUrlQuery,
  getQueryParams,
} from "@/utils/URLEncoder";
import FiltersSideBar from "./FiltersSideBar";
import { Filters, AllFilters } from "@/types/filters";
import { Cuisine } from "@/types/cuisine";
import { MealType } from "@/types/mealType";
import Pagination from "./Pagination";
import { useUserLocation } from "@/utils/useLocation";
import DebouncedInput from "./DebouncedInput";

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
  //loading state
  const [loading, setLoading] = useState<boolean>(false);
  const firstLoad = useRef(true);

  //restaurants
  const [listedRestaurants, setListedRestaurants] =
    useState<Restaurant[]>(restaurants);

  //filters
  const [filters, setFilters] = useState<AllFilters>({
    city: restaurants[0].city,
    name: "",
    minCost: 0,
    maxCost: 10000,
  });
  const location = useUserLocation({ setLoading });
  const [currPage, setCurrPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(pages);

  // sidebar toggle
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);

  // ---------- Handlers ----------------

  const updateBasicInputs = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const updateDebouncedInputs = (val: string, param: string) => {
    setFilters((f) => {
      return { ...filters, [param]: val };
    });
  };

  // ---------- Form Events --------------

  const resetFilters = () => {
    setFilters((f) => ({
      city: f.city,
      name: f.name || "",
      minCost: 0,
      maxCost: 10000,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrPage(1);
    getRestaurants();
  };

  // ----------- Populate filters from URL search params ----------------

  useEffect(() => {
    if (!mealTypes.length && !cuisines.length && !cities.length) return;

    const queryParams = getQueryParams();
    setFilters((prev) => ({
      ...prev,
      ...queryParams.filter,
      city: queryParams.filter.city || "delhi-ncr",
    }));
    setCurrPage(queryParams.page || 1);
  }, [mealTypes, cuisines, cities]);

  // ------------ Fetch Restaurants on filter or page change --------------

  const getRestaurants = async () => {
    setLoading(true);
    try {
      const query = {
        ...filters,
        page: currPage,
        ...location,
      };
      const { data } = await API.get<{
        restaurants: Restaurant[];
        pages: number;
      }>(`/restaurants?${objectToQueryParams(query)}`);
      setListedRestaurants(data.restaurants);
      setTotalPages(data.pages);
      updateUrlQuery(query);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    getRestaurants();
  }, [filters, currPage]);

  // ------------ Get City from user location ----------------

  const getCityByUserLocation = async () => {
    const { data } = await API.get<{ city: string }>(
      `/cities/getCity?lat=${location.lat}&lon=${location.lon}`,
    );
    setFilters((prev) => ({ ...prev, city: data.city }));
    return data.city;
  };

  useEffect(() => {
    setLoading(true);
    getCityByUserLocation();
  }, [location.lat, location.lon]);

  return (
    <div className="px-12">
      {/* Hero */}
      <div className="flex relative px-12 pt-20 pb-12 m-auto text-center flex-col gap-8 items-center text-foreground justify-center flex-1">
        <h1 className="text-[52px] font-poppins uppercase font-bold">
          Discover Your Next{" "}
          <span className="text-primary">Favorite Meal.</span>
        </h1>
        <p className="font-inter text-[20px] text-gray-600 max-w-2xl">
          Find the best restaurants near you with exclusive offers and deals.
          Easy search, easy find.
        </p>
      </div>

      {/* Search Header */}
      <div className="m-auto z-10 items-center sticky top-0 p-4 w-full flex gap-4  bg-white rounded-lg">
        <button
          data-testid="filter-toggle"
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="px-3 h-full py-3 cursor-pointer bg-primary text-background rounded-lg"
        >
          <FunnelPlus className="text-background w-5 h-5" />
        </button>
        <div className="rounded-md px-6 gap-2 flex items-center text-foreground bg-background">
          <MapPin />
          <select
            className="outline-none px-3 border-none py-4"
            value={filters.city}
            onChange={updateBasicInputs}
            name="city"
            data-testid="filter-city"
          >
            <option value="">Select City</option>
            {cities.map((c) => {
              let [firstLetter, ...restChars] = c.city_name;
              return (
                <option value={c.city_name} key={c.id}>
                  {firstLetter.toUpperCase()}
                  {...restChars}
                </option>
              );
            })}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 gap-4">
          <div className="rounded-md flex-1 px-6 gap-6 flex items-center text-foreground bg-background">
            <Search />
            <DebouncedInput
              className="outline-none border-none py-4 flex-1"
              placeholder="Search by restaurant..."
              name="name"
              value={filters.name || ""}
              onChange={updateDebouncedInputs}
            />
          </div>
          <button className="px-6 cursor-pointer py-4 bg-primary rounded-md text-background">
            Search
          </button>
        </form>
      </div>

      {/* Restaurant listing with collapsible sidebar*/}
      <div className="flex transition-all duration-200 gap-6 relative py-6">
        {toggleSideBar && (
          <FiltersSideBar
            cuisines={cuisines}
            mealTypes={mealTypes}
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
          />
        )}
        {listedRestaurants.length > 0 ? (
          <div className="relative w-full">
            <Restaurants restaurants={listedRestaurants} />
          </div>
        ) : (
          <div className="flex flex-col gap-6  w-full justify-center items-center">
            <img src={"no_results.svg"} className="h-60 object-fit" />
            <p className="font-xl font-poppins">No restaurants Found</p>
          </div>
        )}
      </div>

      {/* Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-gray-50/50 z-10">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <LoaderCircle className="animate-spin text-primary w-8 h-8" />
          </div>
        </div>
      )}

      {/* Pagination */}
      {listedRestaurants.length > 0 && (
        <Pagination
          currPage={currPage}
          setCurrPage={setCurrPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default Hero;
