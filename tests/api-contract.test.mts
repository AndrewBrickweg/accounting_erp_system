import assert from "node:assert/strict";
import test from "node:test";
import { Prisma } from "@prisma/client";

import { createdJson, noContent } from "../lib/http.ts";
import { handleValidationError } from "../lib/error.ts";
import { parseSchemaOrThrow } from "../lib/validate.ts";
import {
  chartOfAccountDetailSchema,
  chartOfAccountSchema,
} from "../schemas/chart-of-accounts.ts";
import {
  customerDetailSchema,
  customerSchema,
} from "../schemas/customers.ts";
import {
  departmentDetailSchema,
  departmentSchema,
} from "../schemas/departments.ts";
import {
  employeeDetailSchema,
  employeeSchema,
} from "../schemas/employees.ts";
import {
  glCodingDetailSchema,
  glCodingSchema,
} from "../schemas/gl-codings.ts";
import {
  invoiceDetailSchema,
  invoiceSchema,
} from "../schemas/invoices.ts";
import {
  paymentDetailSchema,
  paymentSchema,
} from "../schemas/payments.ts";
import {
  salesInvoiceDetailSchema,
  salesInvoiceSchema,
} from "../schemas/sales-invoices.ts";
import {
  transactionDetailSchema,
  transactionSchema,
  transactionSchemaUpdate,
} from "../schemas/transactions.ts";
import {
  vendorDetailSchema,
  vendorSchema,
} from "../schemas/vendors.ts";

test("createdJson returns 201 with a Location header", async () => {
  const response = createdJson(
    new Request("http://localhost/api/vendors", { method: "POST" }),
    42,
    { id: 42, name: "Acme" }
  );

  assert.equal(response.status, 201);
  assert.equal(response.headers.get("Location"), "http://localhost/api/vendors/42");
  assert.deepEqual(await response.json(), { id: 42, name: "Acme" });
});

test("noContent returns an empty 204 response", async () => {
  const response = noContent();

  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

test("validation errors use the standard envelope", async () => {
  const response = handleValidationError([
    { path: "totalAmount", message: "Amount must be greater than zero" },
  ]);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: {
      code: "validation_error",
      message: "Validation failed",
      details: {
        issues: [
          {
            path: "totalAmount",
            message: "Amount must be greater than zero",
          },
        ],
      },
    },
  });
});

test("parseSchemaOrThrow normalizes Prisma decimals for response schemas", () => {
  const parsed = parseSchemaOrThrow(
    {
      id: 1,
      invoiceNumber: "INV-100",
      invoiceDate: new Date("2026-03-01T00:00:00.000Z"),
      dueDate: new Date("2026-03-15T00:00:00.000Z"),
      totalAmount: new Prisma.Decimal("120.45"),
      status: "draft",
      vendorId: 10,
      submittedById: "user-1",
      departmentId: 20,
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-01T00:00:00.000Z"),
      currency: "USD",
    },
    invoiceDetailSchema
  );

  assert.equal(parsed.totalAmount, "120.45");
});

test("master data schemas accept valid V1 payloads", () => {
  assert.equal(
    chartOfAccountSchema.safeParse({
      accountNumber: "1000",
      name: "Cash",
      type: "asset",
    }).success,
    true
  );

  assert.equal(
    customerSchema.safeParse({
      companyName: "Acme Corp",
      email: "billing@acme.test",
    }).success,
    true
  );

  assert.equal(
    departmentSchema.safeParse({
      name: "Accounting",
      code: "ACC",
    }).success,
    true
  );

  assert.equal(
    employeeSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "manager",
      departmentId: 1,
    }).success,
    true
  );

  assert.equal(
    vendorSchema.safeParse({
      name: "Vendor Inc",
      contactName: "Pat Smith",
      email: "ap@vendor.test",
      phone: "555-0100",
    }).success,
    true
  );
});

test("financial create schemas require decimal string amounts and valid dates", () => {
  assert.equal(
    invoiceSchema.safeParse({
      invoiceNumber: "INV-001",
      invoiceDate: "2026-03-01",
      dueDate: "2026-03-15",
      totalAmount: "100.25",
      status: "draft",
      vendorId: 1,
      submittedById: "emp-1",
      departmentId: 2,
      currency: "USD",
    }).success,
    true
  );

  assert.equal(
    paymentSchema.safeParse({
      amountPaid: "100.25",
      paymentDate: "2026-03-16",
      method: "wire",
      invoiceId: 1,
      paidById: "emp-1",
    }).success,
    true
  );

  assert.equal(
    salesInvoiceSchema.safeParse({
      invoiceNumber: "SI-001",
      invoiceDate: "2026-03-01",
      dueDate: "2026-03-15",
      totalAmount: "0.00",
      status: "pending",
      customerId: "cust-1",
      submittedById: "emp-1",
      currency: "USD",
      taxAmount: "0.00",
    }).success,
    true
  );

  assert.equal(
    glCodingSchema.safeParse({
      accountId: 1,
      description: "Office supplies",
      amount: "25.00",
      type: "debit",
    }).success,
    true
  );
});

test("financial schemas reject invalid amount and date shapes", () => {
  assert.equal(
    invoiceSchema.safeParse({
      invoiceNumber: "INV-002",
      invoiceDate: "2026-03-15",
      dueDate: "2026-03-01",
      totalAmount: "10.00",
      status: "draft",
      vendorId: 1,
      submittedById: "emp-1",
      departmentId: 2,
    }).success,
    false
  );

  assert.equal(
    paymentSchema.safeParse({
      amountPaid: 10.5,
      paymentDate: "2026-03-16",
      method: "wire",
      invoiceId: 1,
      paidById: "emp-1",
    }).success,
    false
  );

  assert.equal(
    glCodingSchema.safeParse({
      accountId: 1,
      description: "Bad amount",
      amount: "-1.00",
      type: "credit",
    }).success,
    false
  );
});

test("transaction schemas enforce consistent posting state", () => {
  assert.equal(
    transactionSchema.safeParse({
      type: "journal",
      status: "posted",
      postedAt: "2026-03-31T12:00:00.000Z",
    }).success,
    true
  );

  assert.equal(
    transactionSchemaUpdate.safeParse({
      postedAt: "2026-03-31T12:00:00.000Z",
    }).success,
    false
  );

  assert.equal(
    transactionSchemaUpdate.safeParse({
      status: "draft",
      postedAt: null,
    }).success,
    true
  );
});

test("detail schemas match decimal-string financial responses", () => {
  assert.equal(
    chartOfAccountDetailSchema.safeParse({
      id: 1,
      accountNumber: "1000",
      name: "Cash",
      type: "asset",
      isActive: true,
    }).success,
    true
  );

  assert.equal(
    customerDetailSchema.safeParse({
      id: "cust-1",
      companyName: "Acme Corp",
      email: "billing@acme.test",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    }).success,
    true
  );

  assert.equal(
    departmentDetailSchema.safeParse({
      id: 1,
      name: "Accounting",
      code: "ACC",
      managerId: null,
    }).success,
    true
  );

  assert.equal(
    employeeDetailSchema.safeParse({
      id: "emp-1",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "manager",
      departmentId: 1,
      department: {
        id: 1,
        name: "Accounting",
      },
      managerId: null,
      isActive: true,
      terminatedAt: null,
    }).success,
    true
  );

  assert.equal(
    invoiceDetailSchema.safeParse({
      id: 1,
      invoiceNumber: "INV-001",
      invoiceDate: "2026-03-01T00:00:00.000Z",
      dueDate: "2026-03-15T00:00:00.000Z",
      totalAmount: "100.25",
      status: "draft",
      vendorId: 1,
      submittedById: "emp-1",
      departmentId: 2,
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
      currency: "USD",
    }).success,
    true
  );

  assert.equal(
    paymentDetailSchema.safeParse({
      id: 1,
      amountPaid: "100.25",
      paymentDate: "2026-03-16T00:00:00.000Z",
      method: "wire",
      invoiceId: 1,
      paidById: "emp-1",
    }).success,
    true
  );

  assert.equal(
    salesInvoiceDetailSchema.safeParse({
      id: 1,
      invoiceNumber: "SI-001",
      invoiceDate: "2026-03-01T00:00:00.000Z",
      dueDate: "2026-03-15T00:00:00.000Z",
      totalAmount: "0.00",
      status: "pending",
      customerId: "cust-1",
      customer: {
        id: "cust-1",
        companyName: "Acme Corp",
        email: "billing@acme.test",
      },
      submittedById: "emp-1",
      submittedBy: {
        id: "emp-1",
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
      },
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
      currency: "USD",
      taxAmount: "0.00",
    }).success,
    true
  );

  assert.equal(
    glCodingDetailSchema.safeParse({
      id: 1,
      accountId: 1,
      description: "Office supplies",
      amount: "25.00",
      invoiceId: null,
      departmentId: null,
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
      memo: null,
      transactionId: null,
      type: "debit",
    }).success,
    true
  );

  assert.equal(
    transactionDetailSchema.safeParse({
      id: "txn-1",
      date: "2026-03-31T00:00:00.000Z",
      memo: "Month-end accrual",
      postedAt: "2026-03-31T12:00:00.000Z",
      referenceNumber: "REF-1",
      source: "manual",
      status: "posted",
      type: "journal",
      entries: [
        {
          id: 1,
          accountId: 100,
          amount: "250.00",
          description: "Accrual line",
          memo: null,
          departmentId: null,
          invoiceId: null,
          transactionId: "txn-1",
          type: "debit",
          account: {
            id: 100,
            name: "Cash",
            accountNumber: "1000",
            type: "asset",
          },
        },
      ],
    }).success,
    true
  );

  assert.equal(
    vendorDetailSchema.safeParse({
      id: 1,
      name: "Vendor Inc",
      contactName: "Pat Smith",
      email: "ap@vendor.test",
      phone: "555-0100",
      isActive: true,
      address: null,
    }).success,
    true
  );
});
