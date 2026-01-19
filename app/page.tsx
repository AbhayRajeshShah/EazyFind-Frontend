import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { API, BASE_URL } from "@/api/config";
import { Restaurant } from "@/types/restaurant";
import { City } from "@/types/city";

const getRestaurants = async () => {
  const { data } = await API.get<Restaurant[]>("/restaurants/delhi-ncr");
  return data;
};

const getCities = async () => {
  const { data } = await API.get<City[]>("/cities");
  return data;
};

export default async function Home() {
  try {
    const [cities, restaurants] = await Promise.all([
      getCities(),
      getRestaurants(),
    ]);

    return (
      <div className="bg-background w-full">
        <div className="flex flex-col">
          <Navbar />
          <Hero cities={cities} restaurants={restaurants} />
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
