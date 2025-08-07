import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: addressSchema.optional(),
});

export const vendorUpdateSchema = vendorSchema.partial();

export const vendorDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  contactName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: addressSchema.optional(),
  employees: z
    .array(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        role: z.string(),
        departmentId: z.number(),
      })
    )
    .optional(),
});

export const vendorListSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    contactName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: addressSchema.optional(),
  })
);

export type VendorInput = z.infer<typeof vendorSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
export type VendorDetail = z.infer<typeof vendorDetailSchema>;
export type VendorList = z.infer<typeof vendorListSchema>;
