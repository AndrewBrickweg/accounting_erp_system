import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
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
  id: z.number(),
  name: z.string(),
  contactName: z.string(),
  email: z.email(),
  phone: z.string(),
  isActive: z.boolean().optional(),
  address: addressSchema.nullable().optional(),
});

export const vendorListSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    contactName: z.string(),
    email: z.email(),
    phone: z.string(),
    isActive: z.boolean().optional(),
    address: addressSchema.nullable().optional(),
  })
);

export type VendorInput = z.infer<typeof vendorSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
export type VendorDetail = z.infer<typeof vendorDetailSchema>;
export type VendorList = z.infer<typeof vendorListSchema>;
