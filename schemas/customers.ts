import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const customerSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    companyName: z.string().optional(),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    address: addressSchema.optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine(
    (data) =>
      (!!data.companyName && !data.firstName && !data.lastName) ||
      (!data.companyName && !!data.firstName && !!data.lastName),
    {
      message:
        "Either companyName or both firstName and lastName must be provided",
      path: ["companyName", "firstName", "lastName"],
    }
  );

export const customerUpdateSchema = customerSchema.partial();

export const customerListSchema = z.array(
  z.object({
    id: z.number(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    email: z.email(),
    phone: z.string().optional(),
    address: addressSchema.optional(),
  })
);

export const customerDetailSchema = z.object({
  id: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  email: z.email(),
  phone: z.string().optional(),
  address: addressSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
export type CustomerList = z.infer<typeof customerListSchema>;
export type CustomerDetail = z.infer<typeof customerDetailSchema>;
