import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  managerId: z.number().int().optional().nullable(),
  code: z.string().min(1, "Department code is required"),
});

export const departmentUpdateSchema = departmentSchema.partial();

export const departmentListSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    code: z.string().min(1, "Department code is required"),
    manager: z
      .object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .optional()
      .nullable(),
  })
);

export const departmentDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string().min(1, "Department code is required"),
  managerId: z.number().int().optional().nullable(),
  manager: z
    .object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional()
    .nullable(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;
export type DepartmentList = z.infer<typeof departmentListSchema>;
export type DepartmentDetail = z.infer<typeof departmentDetailSchema>;
