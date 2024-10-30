import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
        <Alert variant="success">Booking successful!</Alert>
      )}
      {submissionStatus === "error" && (
        <Alert variant="danger">Failed to book table. Please try again.</Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control {...register("name")} />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" {...register("email")} />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control {...register("phone")} />
          {errors.phone && (
            <Form.Text className="text-danger">
              {errors.phone.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Date & Time</Form.Label>
          <Form.Control type="datetime-local" {...register("dateTime")} />
          {errors.dateTime && (
            <Form.Text className="text-danger">
              {errors.dateTime.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Number of Guests</Form.Label>
          <Form.Control
            type="number"
            {...register("guests", {
              valueAsNumber: true, // Automatically treat value as a number
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
