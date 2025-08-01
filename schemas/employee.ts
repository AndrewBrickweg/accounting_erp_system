import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  role: z.enum(["admin", "manager", "staff"]),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive integer"),
  managerId: z.number().int().optional().nullable(),
});

export const employeeUpdateSchema = employeeSchema.partial();

export const employeeListSchema = z.array(
  z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    department: z.object({
      name: z.string(), // assuming JOIN to get department name
    }),
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

export const employeeDetailSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(["admin", "manager", "staff"]),
  departmentId: z.number().int().positive(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }),
  managerId: z.number().int().positive().nullable().optional(),
  manager: z
    .object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable()
    .optional(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
export type EmployeeList = z.infer<typeof employeeListSchema>;
export type EmployeeDetail = z.infer<typeof employeeDetailSchema>;
