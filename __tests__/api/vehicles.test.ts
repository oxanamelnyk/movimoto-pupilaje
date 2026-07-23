import { describe, expect, it } from "@jest/globals";

/**
 * Integration tests for the vehicle API.
 * The application must be running at http://localhost:3000.
 */

describe("Vehicle Creation API", () => {
  const API_URL = "http://localhost:3000/api/vehicles";

  const validVehicleData = {
    client_id: 1,
    brand_id: 1,
    model_id: 1,
    color_id: 1,
    status_id: 1,
    vin: "TEST123456789",
    plate_number: "ABC-1234",
    notes: "Test vehicle",
    entry_date: "2026-06-28",
    location_id: 1,
    exit_date: null,
    delivery_place: "Test Location",
    request_date: null,
    requested_by: null,
    preparation_date: null,
    preparation_type_id: null,
  };

  function omit<T extends object, K extends keyof T>(
    object: T,
    key: K
  ): Omit<T, K> {
    const copy: Partial<T> = { ...object };
    delete copy[key];

    return copy as Omit<T, K>;
  }

  async function postVehicle(data: object): Promise<Response> {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async function logErrorResponse(response: Response): Promise<void> {
    if (response.ok) {
      return;
    }

    const errorData: unknown = await response.clone().json();

    console.log(
      `❌ API error (${response.status}):`,
      JSON.stringify(errorData, null, 2)
    );
  }

  describe("POST /api/vehicles - Success Cases", () => {
    it("should create a vehicle with all required fields", async () => {
      const response = await postVehicle(validVehicleData);

      await logErrorResponse(response);

      expect(response.status).toBe(201);

      const data: unknown = await response.json();

      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );
    });

    it("should create a vehicle with optional fields as null", async () => {
      const minimalData = {
        client_id: 2,
        brand_id: 2,
        model_id: 2,
        status_id: 2,
        vin: null,
        plate_number: null,
        notes: null,
        entry_date: "2026-06-28",
        location_id: 1,
        exit_date: null,
        delivery_place: null,
        request_date: null,
        requested_by: null,
        preparation_date: null,
        preparation_type_id: null,
      };

      const response = await postVehicle(minimalData);

      await logErrorResponse(response);

      expect(response.status).toBe(201);

      const data: unknown = await response.json();

      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );
    });

    it("should create a vehicle with a storage record", async () => {
      const data = {
        ...validVehicleData,
        entry_date: "2026-06-28",
        location_id: 1,
        delivery_place: "Sant Climent",
      };

      const response = await postVehicle(data);

      await logErrorResponse(response);

      expect(response.status).toBe(201);

      const responseData: unknown = await response.json();

      expect(responseData).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );
    });
  });

  describe("POST /api/vehicles - Validation Errors", () => {
    it("should reject missing client_id", async () => {
      const data = omit(validVehicleData, "client_id");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);

      const errorData: unknown = await response.json();

      expect(errorData).toEqual(
        expect.objectContaining({
          error: expect.stringContaining("Validation"),
        })
      );
    });

    it("should reject missing brand_id", async () => {
      const data = omit(validVehicleData, "brand_id");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);

      const errorData: unknown = await response.json();

      expect(errorData).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should reject missing model_id", async () => {
      const data = omit(validVehicleData, "model_id");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject missing status_id", async () => {
      const data = omit(validVehicleData, "status_id");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject missing entry_date", async () => {
      const data = omit(validVehicleData, "entry_date");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject location_id equal to 0", async () => {
      const data = {
        ...validVehicleData,
        location_id: 0,
      };

      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject missing location_id", async () => {
      const data = omit(validVehicleData, "location_id");
      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject non-integer client_id", async () => {
      const data = {
        ...validVehicleData,
        client_id: "invalid",
      };

      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });

    it("should reject invalid entry_date format", async () => {
      const data = {
        ...validVehicleData,
        entry_date: "not-a-date",
      };

      const response = await postVehicle(data);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/vehicles - Edge Cases", () => {
    it("should handle empty notes", async () => {
      const data = {
        ...validVehicleData,
        notes: "",
      };

      const response = await postVehicle(data);

      await logErrorResponse(response);

      expect(response.status).toBe(201);
    });

    it("should handle a VIN with the maximum length", async () => {
      const data = {
        ...validVehicleData,
        vin: "A".repeat(50),
      };

      const response = await postVehicle(data);

      await logErrorResponse(response);

      expect(response.status).toBe(201);
    });

    it("should accept or reject numeric IDs represented as strings", async () => {
      const data = {
        ...validVehicleData,
        client_id: "1",
        brand_id: "1",
        model_id: "1",
        status_id: "1",
        location_id: "1",
      };

      const response = await postVehicle(data);

      expect([201, 400]).toContain(response.status);
    });
  });

  describe("GET /api/vehicles", () => {
    it("should retrieve the vehicles list", async () => {
      const response = await fetch(API_URL, {
        method: "GET",
      });

      await logErrorResponse(response);

      expect(response.status).toBe(200);

      const data: unknown = await response.json();

      expect(Array.isArray(data)).toBe(true);
    });
  });
});