import { render, screen, fireEvent } from "@testing-library/react";
import RestaurantList from "../RestaurantList";
import { useRestaurants } from "../../hooks/useRestaurants";
import React from "react";

jest.mock("../../hooks/useRestaurants");

const mockRestaurants = [
  {
    id: 1,
    name: "Sushi Paradise",
    shortDescription: "Great sushi",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Velvet & Vine",
    shortDescription: "Fine dining",
    rating: 4.7,
  },
  { id: 3, name: "Bistro Bliss", shortDescription: "Cozy bistro", rating: 3.9 },
];

describe("RestaurantList Component", () => {
  beforeEach(() => {
    (useRestaurants as jest.Mock).mockReturnValue({
      data: mockRestaurants,
      isLoading: false,
      error: null,
    });
  });

  describe("Filtering Functionality", () => {
    test("filters restaurants based on search input", async () => {
      render(<RestaurantList onRestaurantSelect={() => {}} />);

      const searchInput = screen.getByPlaceholderText("Search restaurants...");
      fireEvent.change(searchInput, { target: { value: "Sushi" } });

      const filteredRestaurant = await screen.findByText(/Sushi Paradise/i);
      expect(filteredRestaurant).toBeInTheDocument();

      const nonMatchingRestaurant = screen.queryByText(/Velvet & Vine/i);
      expect(nonMatchingRestaurant).not.toBeInTheDocument();
    });

    test("displays all restaurants when search input is cleared", async () => {
      render(<RestaurantList onRestaurantSelect={() => {}} />);

      const searchInput = screen.getByPlaceholderText("Search restaurants...");
      fireEvent.change(searchInput, { target: { value: "Sushi" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(await screen.findByText(/Sushi Paradise/i)).toBeInTheDocument();
      expect(screen.getByText(/Velvet & Vine/i)).toBeInTheDocument();
      expect(screen.getByText(/Bistro Bliss/i)).toBeInTheDocument();
    });
  });

  describe("Sorting Functionality", () => {
    test("sorts restaurants by name in alphabetical order", async () => {
      render(<RestaurantList onRestaurantSelect={() => {}} />);

      const sortDropdown = screen.getByLabelText("Sort by");
      fireEvent.change(sortDropdown, { target: { value: "name" } });

      const sortedByName = await screen.findAllByRole("button");
      expect(sortedByName[0]).toHaveTextContent("Bistro Bliss");
      expect(sortedByName[1]).toHaveTextContent("Sushi Paradise");
      expect(sortedByName[2]).toHaveTextContent("Velvet & Vine");
    });

    test("sorts restaurants by rating in descending order", async () => {
      render(<RestaurantList onRestaurantSelect={() => {}} />);

      const sortDropdown = screen.getByLabelText("Sort by");
      fireEvent.change(sortDropdown, { target: { value: "rating" } });

      const sortedByRating = await screen.findAllByRole("button");
      expect(sortedByRating[0]).toHaveTextContent("Velvet & Vine");
      expect(sortedByRating[1]).toHaveTextContent("Sushi Paradise");
      expect(sortedByRating[2]).toHaveTextContent("Bistro Bliss");
    });
  });
});
