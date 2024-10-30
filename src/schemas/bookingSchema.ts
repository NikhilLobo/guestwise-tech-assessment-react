import { z } from "zod";

const now = new Date();
const minDateTime = new Date(now.getTime() + 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);
const phoneRegexUK = /^(0\d{10}|\d{10})$/;
export const bookingSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegexUK, "Invalid phone number format"),
  dateTime: z
    .string()
    .nonempty("Date and time are required")
    .refine((value) => new Date(value) >= now, {
      message: "Date and time cannot be in the past.",
    })
    .refine((value) => new Date(value) >= new Date(minDateTime), {
      message: "Bookings must be scheduled for at least 1 hour in the future",
    }),
  guests: z
    .number()
    .min(1, "At least 1 guest is required")
    .max(12, "Maximum of 12 guests allowed"),
});
