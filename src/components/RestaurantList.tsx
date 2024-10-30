import React from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useRestaurants } from "../hooks/useRestaurants";
type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching restaurants</p>;
  return (
    <Container>
      <h2>Restaurants</h2>
      <ListGroup>
        {restaurants.map((restaurant: Restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => onRestaurantSelect(restaurant.id)}
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
