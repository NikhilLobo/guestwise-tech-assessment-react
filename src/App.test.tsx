import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { render, screen } from "@testing-library/react";
import App from "./App";
const queryClient = new QueryClient();

test("renders restaurant list with dynamic restaurant name and description", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  const restaurantName = await screen.findByRole("heading", {
    level: 5,
    name: /Velvet & Vine/i,
  });

  const restaurantDescription = await screen.findByText(
    /A fine dining experience with a modern twist./i
  );

  expect(restaurantName).toBeInTheDocument();
  expect(restaurantDescription).toBeInTheDocument();
});
