import { cities } from "../data/worldcities/cities";
import type { CityRaw } from "../data/worldcities/cities";

type SearchOptions = Partial<{
  limit: number;
  offset: number;
  searchTerm: string;
}>;

export type City = {
  id: number;
  name: string;
  nameAscii: string;
  country: string;
  countryIso3: string;
  capital: string;
  population: number;
};

export interface GetCitiesResult {
  cities: City[];
  totalCount: number;
}

const collator = new Intl.Collator("en", { sensitivity: "base" });
export const getCities = async ({
  limit = 10000,
  offset = 0,
  searchTerm,
}: SearchOptions = {}): Promise<GetCitiesResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  let filteredList: CityRaw[];
  if (!searchTerm || searchTerm.trim() === "") {
    filteredList = cities;
  } else {
    const trimmedSearchTerm = searchTerm.trim();

    // Handle error case
    if (collator.compare(trimmedSearchTerm.toLowerCase(), "error") === 0) {
      throw new Error("Something terrible just happened!");
    }

    // Filter by city name or country name (partial match, case-insensitive)
    filteredList = cities.filter((c: CityRaw): boolean => {
      const cityName = c[1].toLowerCase(); // name
      const cityNameAscii = c[2].toLowerCase(); // nameAscii
      const countryName = c[3].toLowerCase(); // country
      const searchLower = trimmedSearchTerm.toLowerCase();

      return (
        cityName.includes(searchLower) ||
        cityNameAscii.includes(searchLower) ||
        countryName.includes(searchLower)
      );
    });
  }

  const totalCount = filteredList.length;
  const paginatedList = filteredList.slice(offset, offset + limit);

  return {
    cities: paginatedList.map((row: CityRaw) => ({
      id: row[0],
      name: row[1],
      nameAscii: row[2],
      country: row[3],
      countryIso3: row[4],
      capital: row[5],
      population: row[6],
    })),
    totalCount,
  };
};
