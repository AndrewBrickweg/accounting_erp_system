import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});

const customerBaseSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  companyName: z.string().optional(),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  address: addressSchema.optional(),
});

export const customerSchema = customerBaseSchema
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

export const customerUpdateSchema = customerBaseSchema.partial();

export const customerListSchema = z.array(
  z.object({
    id: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    companyName: z.string().nullable().optional(),
    email: z.email(),
    phone: z.string().nullable().optional(),
    address: addressSchema.nullable().optional(),
  })
);

export const customerDetailSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  email: z.email(),
  phone: z.string().nullable().optional(),
  address: addressSchema.nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
export type CustomerList = z.infer<typeof customerListSchema>;
export type CustomerDetail = z.infer<typeof customerDetailSchema>;
