import { test, expect, type Page } from "@playwright/test";

const API_URL = "http://localhost:3000";

async function openVehicleForm(page: Page): Promise<void> {
  await page.goto(API_URL);
  await page.waitForLoadState("networkidle");

  await page
    .getByRole("button", { name: "Añadir Moto" })
    .click();

  await expect(
    page.getByText("Información del Vehículo")
  ).toBeVisible();
}

async function selectOption(
  page: Page,
  placeholder: string,
  option: string,
  useLast = false
): Promise<void> {
  const trigger = page
    .getByRole("button", { name: new RegExp(placeholder, "i") });

  if (useLast) {
    await trigger.last().click();
  } else {
    await trigger.first().click();
  }

  await page.getByText(option, { exact: true }).click();
}

async function fillRequiredVehicleFields(page: Page): Promise<void> {
  await selectOption(page, "Seleccionar cliente", "Juan García");
  await selectOption(page, "Seleccionar marca", "Honda");
  await selectOption(page, "Seleccionar modelo", "CB500F");
  await selectOption(
    page,
    "Seleccionar estado",
    "Almacenado",
    true
  );
  await selectOption(
    page,
    "Seleccionar ubicación",
    "Sant Climent"
  );
}

async function submitVehicleForm(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Guardar" }).click();
}

async function expectVehicleFormClosed(page: Page): Promise<void> {
  await expect(
    page.getByText("Información del Vehículo")
  ).not.toBeVisible({ timeout: 5000 });
}

test.describe("Vehicle Form - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(API_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display the form with all fields", async ({ page }) => {
    await expect(
      page.getByText("Almacenamiento de Motos")
    ).toBeVisible();

    await expect(page.getByText("Cliente", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Estado del Vehículo", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("Marca", { exact: true })).toBeVisible();
    await expect(page.getByText("Modelo", { exact: true })).toBeVisible();
    await expect(page.getByText("Color", { exact: true })).toBeVisible();
  });

  test("should show validation errors when submitting an empty form", async ({
    page,
  }) => {
    await openVehicleForm(page);
    await submitVehicleForm(page);

    const validationErrors = page.getByText(
      /Se requiere cliente|Se requiere marca|Se requiere estado|Se requiere ubicación/i
    );

    await expect(validationErrors.first()).toBeVisible();
  });

  test("should successfully submit the form with all required fields", async ({
    page,
  }) => {
    await openVehicleForm(page);
    await fillRequiredVehicleFields(page);

    await selectOption(page, "Seleccionar color", "Black");

    await page
      .getByPlaceholder("Ingrese VIN")
      .fill("TEST123456789");

    await page
      .getByPlaceholder("Ingrese número de placa")
      .fill("ABC-1234");

    await page
      .getByPlaceholder("Ingrese lugar de entrega")
      .fill("Test Location");

    await submitVehicleForm(page);
    await expectVehicleFormClosed(page);
  });

  test("should populate dropdowns with database data", async ({ page }) => {
    await openVehicleForm(page);

    await page
      .getByRole("button", { name: /Seleccionar cliente/i })
      .first()
      .click();

    await expect(page.getByText("Juan García", { exact: true })).toBeVisible();
    await expect(page.getByText("María López", { exact: true })).toBeVisible();

    await page.keyboard.press("Escape");

    await page
      .getByRole("button", { name: /Seleccionar marca/i })
      .first()
      .click();

    await expect(page.getByText("Honda", { exact: true })).toBeVisible();
    await expect(page.getByText("Yamaha", { exact: true })).toBeVisible();
    await expect(page.getByText("BMW", { exact: true })).toBeVisible();

    await page.keyboard.press("Escape");

    await page
      .getByRole("button", { name: /Seleccionar estado/i })
      .last()
      .click();

    await expect(page.getByText("Almacenado", { exact: true })).toBeVisible();
    await expect(page.getByText("Preparado", { exact: true })).toBeVisible();
    await expect(page.getByText("Entregado", { exact: true })).toBeVisible();
  });

  test("should display placeholder text in empty selectors", async ({
    page,
  }) => {
    await openVehicleForm(page);

    await expect(
      page
        .getByRole("button", { name: /Seleccionar cliente/i })
        .first()
    ).toContainText("Seleccionar cliente");

    await expect(
      page
        .getByRole("button", { name: /Seleccionar marca/i })
        .first()
    ).toContainText("Seleccionar marca");
  });

  test("should pre-fill entry date with today's date", async ({ page }) => {
    await openVehicleForm(page);

    const today = new Date().toISOString().split("T")[0];

    const entryDateField = page.locator(
      `input[type="date"][value="${today}"]`
    );

    await expect(entryDateField).toBeVisible();
  });

  test("should allow optional fields to remain empty", async ({ page }) => {
    await openVehicleForm(page);
    await fillRequiredVehicleFields(page);

    await submitVehicleForm(page);
    await expectVehicleFormClosed(page);
  });
});