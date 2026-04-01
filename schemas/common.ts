import { z } from "zod";

const DECIMAL_18_2_REGEX = /^(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/;
const ZERO_DECIMAL_REGEX = /^0(?:\.0{1,2})?$/;

function buildMoneySchema(message: string) {
  return z
    .string()
    .trim()
    .regex(
      DECIMAL_18_2_REGEX,
      `${message} must be a decimal string with up to 2 decimal places`
    );
}

export const decimalStringSchema = buildMoneySchema("Amount");

export const positiveMoneySchema = (label: string) =>
  buildMoneySchema(label).refine((value) => !ZERO_DECIMAL_REGEX.test(value), {
    message: `${label} must be greater than zero`,
  });

export const nonNegativeMoneySchema = (label: string) =>
  buildMoneySchema(label).refine((value) => !value.startsWith("-"), {
    message: `${label} must be zero or greater`,
  });
