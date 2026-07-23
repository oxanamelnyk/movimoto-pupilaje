export interface TariffService {
  id: number;
  tariff_id: number;
  name: string;
  price: string;
  unit: string;
  type: "Fixed" | "Variable";
  discount: string | null;
  category: "Delivery" | "Storage";
  created_at: string | null;
  updated_at: string | null;
}
