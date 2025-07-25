import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

export const vendorUpdateSchema = vendorSchema.partial();

export const vendorDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  contactName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  employees: z
    .array(
      z.object({
        id: z.number(),
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
    id: z.number(),
    name: z.string(),
    contactName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  })
);

export type VendorInput = z.infer<typeof vendorSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
export type VendorDetail = z.infer<typeof vendorDetailSchema>;
export type VendorList = z.infer<typeof vendorListSchema>;
