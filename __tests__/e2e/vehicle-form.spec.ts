import { test, expect } from "@playwright/test";

test.describe("Vehicle Form - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form page
    await page.goto("http://localhost:3000/");
    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("should display the form with all fields", async ({ page }) => {
    // Check form title
    await expect(page.locator("text=Almacenamiento de Motos")).toBeVisible();

    // Check all labels are present
    await expect(page.locator("text=Cliente")).toBeVisible();
    await expect(page.locator("text=Estado del Vehículo")).toBeVisible();
    await expect(page.locator("text=Marca")).toBeVisible();
    await expect(page.locator("text=Modelo")).toBeVisible();
    await expect(page.locator("text=Color")).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({
    page,
  }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // Try to submit without filling fields
    await page.click("button:has-text('Guardar')");

    // Should see validation error messages
    const errorMessages = page.locator(
      "text=/Se requiere cliente|Se requiere marca|Se requiere estado|Se requiere ubicación/"
    );
    await expect(errorMessages.first()).toBeVisible();
  });

  test("should successfully submit form with all required fields", async ({
    page,
  }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // Fill client dropdown
    await page.click('button:has-text("Seleccionar cliente")').first();
    await page.click("text=Juan García");

    // Fill brand dropdown
    await page.click('button:has-text("Seleccionar marca")');
    await page.click("text=Honda");

    // Fill model dropdown
    await page.click('button:has-text("Seleccionar modelo")');
    await page.click("text=CB500F");

    // Fill color dropdown
    await page.click('button:has-text("Seleccionar color")');
    await page.click("text=Black");

    // Fill status dropdown
    await page.click('button:has-text("Seleccionar estado")').last();
    await page.click("text=Almacenado");

    // Fill VIN
    await page.fill('input[placeholder="Ingrese VIN"]', "TEST123456789");

    // Fill plate number
    await page.fill('input[placeholder="Ingrese número de placa"]', "ABC-1234");

    // Fill location dropdown
    await page.click('button:has-text("Seleccionar ubicación")');
    await page.click("text=Sant Climent");

    // Fill delivery place
    await page.fill(
      'input[placeholder="Ingrese lugar de entrega"]',
      "Test Location"
    );

    // Submit the form
    await page.click("button:has-text('Guardar')");

    // Wait for success feedback (drawer should close or message should appear)
    await page.waitForTimeout(1000);

    // Check if we're back to the main page (drawer is closed)
    const drawer = page.locator("text=Información del Vehículo");
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });

  test("should populate dropdowns with data from database", async ({
    page,
  }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // Check client dropdown has data
    await page.click('button:has-text("Seleccionar cliente")').first();
    await expect(page.locator("text=Juan García")).toBeVisible();
    await expect(page.locator("text=María López")).toBeVisible();

    // Close dropdown
    await page.press("Escape");

    // Check brand dropdown has data
    await page.click('button:has-text("Seleccionar marca")');
    await expect(page.locator("text=Honda")).toBeVisible();
    await expect(page.locator("text=Yamaha")).toBeVisible();
    await expect(page.locator("text=BMW")).toBeVisible();

    // Close dropdown
    await page.press("Escape");

    // Check status dropdown has data
    await page.click('button:has-text("Seleccionar estado")').last();
    await expect(page.locator("text=Almacenado")).toBeVisible();
    await expect(page.locator("text=Preparado")).toBeVisible();
    await expect(page.locator("text=Entregado")).toBeVisible();
  });

  test("should display placeholder text in empty selectors", async ({
    page,
  }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // Check that placeholders are visible
    const clientPlaceholder = page
      .locator('button:has-text("Seleccionar cliente")')
      .first();
    await expect(clientPlaceholder).toHaveText(/Seleccionar cliente/);

    const marcaPlaceholder = page.locator(
      'button:has-text("Seleccionar marca")'
    );
    await expect(marcaPlaceholder).toHaveText(/Seleccionar marca/);
  });

  test("should handle date selection", async ({ page }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // The entry date should be pre-filled with today's date
    const entryDateField = page.locator('input[value*="2026-06-28"]');
    await expect(entryDateField).toBeVisible();
  });

  test("should allow optional fields to be empty", async ({ page }) => {
    // Click the add vehicle button
    await page.click("button:has-text('Añadir Moto')");

    // Wait for drawer to open
    await page.waitForSelector("text=Información del Vehículo");

    // Fill only required fields
    await page.click('button:has-text("Seleccionar cliente")').first();
    await page.click("text=Juan García");

    await page.click('button:has-text("Seleccionar marca")');
    await page.click("text=Honda");

    await page.click('button:has-text("Seleccionar modelo")');
    await page.click("text=CB500F");

    await page.click('button:has-text("Seleccionar estado")').last();
    await page.click("text=Almacenado");

    await page.click('button:has-text("Seleccionar ubicación")');
    await page.click("text=Sant Climent");

    // Leave VIN and plate empty (optional fields)
    // Leave delivery place empty (optional field)

    // Submit the form
    await page.click("button:has-text('Guardar')");

    // Should succeed without validation errors
    await page.waitForTimeout(1000);

    // Check if drawer is closed (success)
    const drawer = page.locator("text=Información del Vehículo");
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });
});
