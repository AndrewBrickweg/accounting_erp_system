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
});

export const employeeUpdateSchema = employeeSchema.partial();

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
