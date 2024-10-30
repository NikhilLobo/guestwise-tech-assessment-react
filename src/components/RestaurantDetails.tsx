import React, { useEffect, useState } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { getRestaurantDetails } from "../services/api";
import { useRestaurantDetails } from "../hooks/useRestaurantDetails";

type RestaurantDetailsProps = {
  restaurantId: number;
};

type RestaurantDetailsData = {
  address: string;
  openingHours: {
    weekday: string;
    weekend: string;
  };
  reviewScore: number;
  contactEmail: string;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurantId,
}) => {
  const {
    data: details,
    isLoading,
    error,
  } = useRestaurantDetails(restaurantId);
  if (isLoading) return <Spinner animation="border" />;
  if (error) return <p>Failed to fetch restaurant details.</p>;
  if (!details) return null;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Restaurant Details</Card.Title>
          <Card.Text>Name: {details.name}</Card.Text>
          <Card.Text>Address: {details.details.address}</Card.Text>
          <Card.Text>Address: {details.details.address}</Card.Text>
          <Card.Text>Review Score: {details.rating}</Card.Text>
          <Card.Text>Contact: {details.details.contactEmail}</Card.Text>
          <Card.Text>Opening Hours</Card.Text>
          <Card.Text>Weekday: {details.details.openingHours.weekday}</Card.Text>
          <Card.Text>Weekend: {details.details.openingHours.weekend}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;
