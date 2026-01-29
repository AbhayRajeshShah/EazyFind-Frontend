import { test, expect } from "@playwright/test";

test("initial load: home page loads with restaurants or error", async ({
  page,
}) => {
  await page.goto("/");

  const restaurants = page.getByTestId("restaurant-item");
  const error = page.getByTestId("error-message");

  await Promise.race([restaurants.first().waitFor(), error.waitFor()]);

  const restaurantCount = await restaurants.count();
  const hasError = await error.count();

  if (hasError > 0) {
    await expect(error).toBeVisible();
  } else {
    expect(restaurantCount).toBe(12);
  }
});

test("toggle interaction: sidebar filter toggle behaves as expected", async ({
  page,
}) => {
  await page.goto("/");
  const toggleButton = page.getByTestId("filter-toggle");
  const sidebarFilter = page.getByTestId("filter-sidebar");

  await expect(sidebarFilter).toBeHidden();
  await toggleButton.click();
  await expect(sidebarFilter).toBeVisible();
  await toggleButton.click();
  await expect(sidebarFilter).toBeHidden();
});

test("filter change: changing city updates URL and restaurant list", async ({
  page,
}) => {
  await page.goto("/?city=mumbai&page=1&minCost=0&maxCost=10000");

  const restaurants = page.getByTestId("restaurant-item");
  const citySelect = page.getByTestId("filter-city");

  await expect(restaurants.first()).toBeVisible();

  await citySelect.selectOption("delhi-ncr");

  await expect(page).toHaveURL(/city=delhi-ncr/);

  await expect(restaurants.first()).toBeVisible();

  const countAfter = await restaurants.count();
  expect(countAfter).toBeGreaterThan(0);
});

test("no results found", async ({ page }) => {
  await page.goto("/?city=invalid-city&page=1&minCost=0&maxCost=10000");
  const error = page.getByTestId("error");
  await expect(error).toBeVisible();
  await expect(error).toHaveText("No restaurants found");
});

test("debounced input: name filter input is debounced and updates URL + restaurants", async ({
  page,
}) => {
  await page.goto("/");

  const nameInput = page.getByTestId("filter-name");
  const restaurants = page.getByTestId("restaurant-item");

  await expect(restaurants.first()).toBeVisible();

  await nameInput.type("pizza", { delay: 50 });

  await expect(page).not.toHaveURL(/name=pizza/);

  await page.waitForTimeout(500);
  await expect(restaurants.first()).toBeVisible();
  await expect(page).toHaveURL(/name=pizza/);
});
