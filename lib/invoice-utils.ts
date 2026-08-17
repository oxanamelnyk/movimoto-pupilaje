/**
 * Calculate number of days between two dates
 */
export function calculateDays(
  entryDate: string,
  exitDate: string | null,
): number {
  const entry = new Date(entryDate);
  const exit = exitDate ? new Date(exitDate) : new Date();

  const diffTime = Math.abs(exit.getTime() - entry.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays || 1; // Minimum 1 day
}

/**
 * Calculate number of months between two dates
 */
export function calculateMonths(
  entryDate: string,
  exitDate: string | null,
): number {
  const entry = new Date(entryDate);
  const exit = exitDate ? new Date(exitDate) : new Date();

  let months = (exit.getFullYear() - entry.getFullYear()) * 12;
  months += exit.getMonth() - entry.getMonth();

  return Math.max(1, months); // Minimum 1 month
}

/**
 * Get month start and end dates for a given month within period
 */
export function getMonthPeriods(
  entryDate: string,
  exitDate: string | null,
): Array<{ start: Date; end: Date; label: string }> {
  const entry = new Date(entryDate);
  const exit = exitDate ? new Date(exitDate) : new Date();

  const periods = [];
  let current = new Date(entry);

  while (current < exit) {
    const periodStart = new Date(current);
    const nextMonth = new Date(
      Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1),
    );
    const periodEnd = nextMonth > exit ? exit : nextMonth;

    const label = current.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });

    periods.push({
      start: periodStart,
      end: periodEnd,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    });

    current = periodEnd;
  }

  return periods;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

export interface PricingRates {
  dailyRate: number; // €/day
  handlingInOut: number; // €
  disassemblyWithoutWheels: number; // €
  disassemblyWithWheels: number; // €
  wasteDisposal: number; // €
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface TariffPricingService {
  name: string;
  price: string | number | null;
  unit: string;
  discount?: string | number | null;
}

function isDailyUnit(unit: string): boolean {
  return unit
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() === "dia";
}

function getDiscountedPrice(service: TariffPricingService): number {
  const price = Number(service.price) || 0;
  const discount = Number(service.discount) || 0;

  return price * (1 - discount / 100);
}

export function calculateTariffPeriodCost(
  entryDate: string,
  exitDate: string | null,
  services: TariffPricingService[],
): { items: InvoiceLineItem[]; subtotal: number } {
  const days = calculateDays(entryDate, exitDate);
  const items = services.map((service) => {
    const daily = isDailyUnit(service.unit);
    const quantity = daily ? days : 1;
    const unitPrice = getDiscountedPrice(service);

    return {
      description: daily
        ? `${service.name} (${days} día${days > 1 ? "s" : ""})`
        : service.name,
      quantity,
      unitPrice,
      amount: quantity * unitPrice,
    };
  });

  return {
    items,
    subtotal: items.reduce((sum, item) => sum + item.amount, 0),
  };
}

export function calculateTariffMonthlyCost(
  entryDate: string,
  exitDate: string | null,
  services: TariffPricingService[],
): {
  items: Array<{ month: string; items: InvoiceLineItem[]; subtotal: number }>;
  totalSubtotal: number;
} {
  const periods = getMonthPeriods(entryDate, exitDate);
  const items = periods.map((period, periodIndex) => {
    const days = Math.max(
      1,
      Math.ceil(
        (period.end.getTime() - period.start.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const periodItems = services
      .filter((service) => isDailyUnit(service.unit) || periodIndex === 0)
      .map((service) => {
        const daily = isDailyUnit(service.unit);
        const quantity = daily ? days : 1;
        const unitPrice = getDiscountedPrice(service);

        return {
          description: daily
            ? `${service.name} (${days} día${days > 1 ? "s" : ""})`
            : service.name,
          quantity,
          unitPrice,
          amount: quantity * unitPrice,
        };
      });

    return {
      month: period.label,
      items: periodItems,
      subtotal: periodItems.reduce((sum, item) => sum + item.amount, 0),
    };
  });

  return {
    items,
    totalSubtotal: items.reduce((sum, period) => sum + period.subtotal, 0),
  };
}

/**
 * Calculate storage cost by period
 */
export function calculatePeriodCost(
  entryDate: string,
  exitDate: string | null,
  rates: PricingRates,
  hasDisassembly: boolean = false,
  hasWheels: boolean = false,
  includeWaste: boolean = false,
): {
  items: InvoiceLineItem[];
  subtotal: number;
} {
  const days = calculateDays(entryDate, exitDate);
  const items: InvoiceLineItem[] = [];

  // Storage cost (daily rate * days)
  const storageCost = days * rates.dailyRate;
  items.push({
    description: `Almacenamiento (${days} día${days > 1 ? "s" : ""})`,
    quantity: days,
    unitPrice: rates.dailyRate,
    amount: storageCost,
  });

  // Handling (one-time)
  if (rates.handlingInOut > 0) {
    items.push({
      description: "Manipulación entrada/salida",
      quantity: 1,
      unitPrice: rates.handlingInOut,
      amount: rates.handlingInOut,
    });
  }

  // Disassembly (optional)
  if (hasDisassembly) {
    const disassemblyCost = hasWheels
      ? rates.disassemblyWithWheels
      : rates.disassemblyWithoutWheels;
    const label = hasWheels
      ? "Desembalaje con montaje de rueda"
      : "Desembalaje sin montaje";
    items.push({
      description: label,
      quantity: 1,
      unitPrice: disassemblyCost,
      amount: disassemblyCost,
    });
  }

  // Waste disposal (optional)
  if (includeWaste) {
    items.push({
      description: "Residuos (cajas no metálicas)",
      quantity: 1,
      unitPrice: rates.wasteDisposal,
      amount: rates.wasteDisposal,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  return { items, subtotal };
}

/**
 * Calculate storage cost by month
 */
export function calculateMonthlyCost(
  entryDate: string,
  exitDate: string | null,
  rates: PricingRates,
  hasDisassembly: boolean = false,
  hasWheels: boolean = false,
  includeWaste: boolean = false,
): {
  items: Array<{ month: string; items: InvoiceLineItem[]; subtotal: number }>;
  totalSubtotal: number;
} {
  const periods = getMonthPeriods(entryDate, exitDate);
  const monthlyBreakdowns: Array<{
    month: string;
    items: InvoiceLineItem[];
    subtotal: number;
  }> = [];
  let totalSubtotal = 0;

  periods.forEach((period) => {
    const days = Math.ceil(
      (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const items: InvoiceLineItem[] = [];

    // Storage for this month
    const storageCost = days * rates.dailyRate;
    items.push({
      description: `Almacenamiento (${days} día${days > 1 ? "s" : ""})`,
      quantity: days,
      unitPrice: rates.dailyRate,
      amount: storageCost,
    });

    // Handling only in first month
    if (periods[0] === period && rates.handlingInOut > 0) {
      items.push({
        description: "Manipulación entrada/salida",
        quantity: 1,
        unitPrice: rates.handlingInOut,
        amount: rates.handlingInOut,
      });
    }

    // Disassembly only in first month
    if (periods[0] === period && hasDisassembly) {
      const disassemblyCost = hasWheels
        ? rates.disassemblyWithWheels
        : rates.disassemblyWithoutWheels;
      const label = hasWheels
        ? "Desembalaje con montaje de rueda"
        : "Desembalaje sin montaje";
      items.push({
        description: label,
        quantity: 1,
        unitPrice: disassemblyCost,
        amount: disassemblyCost,
      });
    }

    // Waste disposal only in first month
    if (periods[0] === period && includeWaste) {
      items.push({
        description: "Residuos (cajas no metálicas)",
        quantity: 1,
        unitPrice: rates.wasteDisposal,
        amount: rates.wasteDisposal,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    monthlyBreakdowns.push({
      month: period.label,
      items,
      subtotal,
    });

    totalSubtotal += subtotal;
  });

  return {
    items: monthlyBreakdowns,
    totalSubtotal,
  };
}

/**
 * Calculate total with tax
 */
export function calculateTotal(
  subtotal: number,
  taxPercentage: number = 21,
): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const taxAmount = (subtotal * taxPercentage) / 100;
  const total = subtotal + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
