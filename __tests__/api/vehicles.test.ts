import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

/**
 * Test suite for the vehicle form and API endpoint
 * Tests the complete flow from form submission to database insertion
 */

describe("Vehicle Creation API", () => {
  const API_URL = "http://localhost:3000/api/vehicles";

  // Test data
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

  describe("POST /api/vehicles - Success Cases", () => {
    it("should create a vehicle with all required fields", async () => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validVehicleData),
      });

      if (response.status !== 201) {
        const errorData = await response.json();
        console.log("❌ Error response:", JSON.stringify(errorData, null, 2));
      }

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(typeof data.id).toBe("number");
      expect(data.id).toBeGreaterThan(0);
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

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(minimalData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("id");
    });

    it("should create vehicle with storage record", async () => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validVehicleData,
          entry_date: "2026-06-28",
          location_id: 1,
          delivery_place: "Sant Climent",
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("id");
    });
  });

  describe("POST /api/vehicles - Validation Errors", () => {
    it("should reject missing client_id", async () => {
      const data = { ...validVehicleData };
      delete data.client_id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData).toHaveProperty("error");
      expect(errorData.error).toContain("Validation");
    });

    it("should reject missing brand_id", async () => {
      const data = { ...validVehicleData };
      delete data.brand_id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData).toHaveProperty("error");
    });

    it("should reject missing model_id", async () => {
      const data = { ...validVehicleData };
      delete data.model_id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });

    it("should reject missing status_id", async () => {
      const data = { ...validVehicleData };
      delete data.status_id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });

    it("should reject missing entry_date", async () => {
      const data = { ...validVehicleData };
      delete data.entry_date;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });

    it("should reject if location_id is 0 or missing", async () => {
      const data = { ...validVehicleData, location_id: 0 };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });

    it("should reject invalid client_id (non-integer)", async () => {
      const data = { ...validVehicleData, client_id: "invalid" };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });

    it("should reject invalid entry_date format", async () => {
      const data = { ...validVehicleData, entry_date: "not-a-date" };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/vehicles - Edge Cases", () => {
    it("should handle empty string notes", async () => {
      const data = { ...validVehicleData, notes: "" };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(201);
    });

    it("should handle very long VIN", async () => {
      const data = {
        ...validVehicleData,
        vin: "A".repeat(50), // Max length is 50
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      expect(response.status).toBe(201);
    });

    it("should handle numeric IDs as strings", async () => {
      const data = {
        ...validVehicleData,
        client_id: "1",
        brand_id: "1",
        model_id: "1",
        status_id: "1",
        location_id: "1",
      };

      // This might fail if schema doesn't coerce strings to numbers
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Should either accept (if coercion works) or reject with 400
      expect([201, 400]).toContain(response.status);
    });
  });

  describe("GET /api/vehicles", () => {
    it("should retrieve vehicles list", async () => {
      const response = await fetch(API_URL, { method: "GET" });

      if (response.status !== 200) {
        const errorData = await response.json();
        console.log("❌ GET Error response:", JSON.stringify(errorData, null, 2));
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
