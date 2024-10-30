import React, { useState, useMemo } from "react";
import { ListGroup, Container, Form } from "react-bootstrap";
import { useRestaurants } from "../hooks/useRestaurants";
type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { data: restaurants, isLoading, error } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const displayedRestaurants = useMemo(() => {
    if (!restaurants) return [];

    return restaurants
      .filter((restaurant: Restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: Restaurant, b: Restaurant) => {
        return sortOption === "name"
          ? a.name.localeCompare(b.name)
          : b.rating - a.rating;
      });
  }, [restaurants, searchQuery, sortOption]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching restaurants</p>;

  return (
    <Container>
      <h2>Restaurants</h2>
      <Form.Control
        type="text"
        placeholder="Search restaurants..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />

      <Form.Select
        aria-label="Sort by"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="mb-3"
      >
        <option value="name">Sort by Name</option>
        <option value="rating">Sort by Rating</option>
      </Form.Select>
      <ListGroup>
        {displayedRestaurants.map((restaurant: Restaurant) => (
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
