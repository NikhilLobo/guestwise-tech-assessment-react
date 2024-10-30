import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../services/api";

export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
};
