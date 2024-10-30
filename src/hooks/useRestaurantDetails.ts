import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetails } from "../services/api";

export const useRestaurantDetails = (id: number) => {
  return useQuery({
    queryKey: ["restaurantDetails", id],
    queryFn: () => getRestaurantDetails(id),
    enabled: !!id,
  });
};
