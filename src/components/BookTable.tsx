import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../schemas/bookingSchema";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { z } from "zod";

type BookingFormInputs = z.infer<typeof bookingSchema>;

const BookTable: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormInputs) => {
    const formData = {
      ...data,
      guests: Number(data.guests),
    };
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      const response = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Booking failed");
      setSubmissionStatus("success");
      reset();
      console.log("Booking successful");
    } catch (err) {
      setSubmissionStatus("error");
      console.log(err);
    } finally {
      setIsSubmitting(false);
      console.log("Completed request");
    }
  };

  return (
    <Container>
      <h2>Book a Table</h2>

      {submissionStatus === "success" && (
        <Alert variant="success" role="alert">
          Booking successful!
        </Alert>
      )}
      {submissionStatus === "error" && (
        <Alert variant="danger" role="alert">
          Failed to book table. Please try again.
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control id="name" aria-label="name" {...register("name")} />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            id="email"
            type="email"
            aria-label="email"
            {...register("email")}
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="phone">Phone</Form.Label>
          <Form.Control id="phone" aria-label="phone" {...register("phone")} />
          {errors.phone && (
            <Form.Text className="text-danger">
              {errors.phone.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="dateTime">Date & Time</Form.Label>
          <Form.Control
            id="dateTime"
            type="datetime-local"
            aria-label="dateTime"
            {...register("dateTime")}
          />
          {errors.dateTime && (
            <Form.Text className="text-danger">
              {errors.dateTime.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="guests">Number of Guests</Form.Label>
          <Form.Control
            id="guests"
            type="number"
            aria-label="guests"
            {...register("guests", {
              valueAsNumber: true,
            })}
          />
          {errors.guests && (
            <Form.Text className="text-danger">
              {errors.guests.message}
            </Form.Text>
          )}
        </Form.Group>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Book Table"}
        </Button>
      </Form>
    </Container>
  );
};

export default BookTable;
