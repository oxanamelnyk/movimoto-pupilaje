import { describe, expect, it } from "@jest/globals";

import {
  calculateTariffMonthlyCost,
  calculateTariffPeriodCost,
} from "@/lib/invoice-utils";

const services = [
  {
    name: "Almacenamiento",
    price: "0.30",
    unit: "dia",
    discount: "10",
  },
  {
    name: "Manipulación",
    price: "3.00",
    unit: "unidad",
    discount: null,
  },
];

describe("tariff invoice calculations", () => {
  it("charges daily services per day and unit services once", () => {
    const result = calculateTariffPeriodCost(
      "2026-08-01",
      "2026-08-11",
      services,
    );

    expect(result.items).toEqual([
      expect.objectContaining({ quantity: 10, unitPrice: 0.27, amount: 2.7 }),
      expect.objectContaining({ quantity: 1, unitPrice: 3, amount: 3 }),
    ]);
    expect(result.subtotal).toBeCloseTo(5.7);
  });

  it("splits every month and charges unit services only in the first month", () => {
    const result = calculateTariffMonthlyCost(
      "2026-08-01",
      "2026-10-01",
      services,
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0].items).toHaveLength(2);
    expect(result.items[1].items).toHaveLength(1);
    expect(result.items.flatMap((period) => period.items)[0].quantity).toBe(31);
    expect(result.items[1].items[0].quantity).toBe(30);
  });
});
