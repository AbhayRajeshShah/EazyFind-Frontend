import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { API } from "@/api/config";
import { Restaurant } from "@/types/restaurant";
import { City } from "@/types/city";
import { MealType } from "@/types/mealType";
import { Cuisine } from "@/types/cuisine";

const getRestaurants = async () => {
  const { data } = await API.get<Restaurant[]>("/restaurants/delhi-ncr");
  return data;
};

const getCities = async () => {
  const { data } = await API.get<City[]>("/cities");
  return data;
};

const getMealTypes = async () => {
  const { data } = await API.get<MealType[]>("/meal-types");
  return data;
};

const getCuisines = async () => {
  const { data } = await API.get<Cuisine[]>("/cuisines");
  return data;
};

export default async function Home() {
  try {
    const [cities, restaurants, mealTypes, cuisines] = await Promise.all([
      getCities(),
      getRestaurants(),
      getMealTypes(),
      getCuisines(),
    ]);

    return (
      <div className="bg-background w-full">
        <div className="flex relative flex-col">
          <Navbar />
          <Hero
            cities={cities}
            restaurants={restaurants}
            mealTypes={mealTypes}
            cuisines={cuisines}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load home data", error);

    return (
      <div className="bg-background w-full flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          Failed to load data. Please try again later.
        </p>
      </div>
    );
  }
}
