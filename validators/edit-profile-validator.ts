import { z } from "zod";

export const editProfileValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Please fill the name field" }),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Image is required" }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .length(10, { message: "Phone number must be 10 digits long" }),
  branch: z
    .string({ required_error: "Branch is required" })
    .min(1, { message: "Please select a branch" }),
  year: z
    .string({ required_error: "Year is required" })
    .min(1, { message: "Please select a year" }),
  rollNo: z
    .string({ required_error: "Roll number is required" })
    .min(1, { message: "Please fill in the roll number field" }),
});
