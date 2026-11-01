import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for (const width of [390, 768, 1280]) {
  test(`responsive routes and WCAG automated checks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of [
      '/',
      '/visibility',
      '/contact',
      '/blueprint',
      '/studio/inquire',
      '/studio/onboarding',
      '/studio',
      '/studio/quote',
      '/consulting',
      '/consulting/request',
      '/about',
      '/privacy',
      '/terms',
      '/studio/demos/home-services',
      '/studio/demos/professional',
      '/studio/demos/hospitality',
    ]) {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('main h1')).toBeVisible()
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true)
      for (const title of await page.locator('.demo-art strong').all()) {
        expect(
          await title.evaluate((el) => el.scrollWidth <= el.clientWidth)
        ).toBe(true)
      }
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(
        results.violations,
        route + ': ' + JSON.stringify(results.violations)
      ).toEqual([])
    }
  })
}
test('keyboard skip link, mobile navigation, and self-check', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByText('Skip to content')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
  await page.locator('summary').click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Free visibility check' })
    .click()
  await expect(page).toHaveURL(/visibility$/)
  await page
    .getByRole('button', { name: 'View my preliminary self-check' })
    .click()
  await expect(page.getByText('Preliminary observations')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Request submission unavailable' })
  ).toBeDisabled()
})
test('industry interaction and quote journey remain honest', async ({
  page,
}) => {
  await page.goto('/studio/demos/home-services')
  await page.getByText('Can I book or order through this demo?').click()
  await expect(
    page.getByText(/This demonstration does not accept/)
  ).toBeVisible()
  await page.getByRole('link', { name: 'Build a website like this' }).click()
  await expect(page).toHaveURL(/studio\/quote$/)
  await expect(page.getByText(/Intake is not connected/)).toBeVisible()
})
test('SEO, security headers, fail-closed endpoint and native 404', async ({
  request,
}) => {
  const home = await request.get('/')
  expect(home.headers()['x-frame-options']).toBe('DENY')
  expect(home.headers()['content-security-policy']).toContain(
    "object-src 'none'"
  )
  const sitemap = await request.get('/sitemap.xml')
  expect(await sitemap.text()).toContain(
    'https://carolina-ai-vision.vercel.app/studio'
  )
  expect((await request.get('/not-a-page')).status()).toBe(404)
  const result = await request.post('/api/leads', {
    headers: { origin: 'http://localhost:3000' },
    data: {
      journey: 'website',
      name: 'Synthetic',
      email: 'synthetic@example.com',
      business: 'Test only',
      goal: 'E2E check',
      consent: true,
      startedAt: Date.now() - 5000,
      requestId: 'b4364a1d-363d-4d12-bb60-4040dcfe03ea',
    },
  })
  expect(result.status()).toBe(503)
})

test('inherited industry slugs render not-found content, not runtime errors', async ({
  page,
}) => {
  for (const slug of ['constructor', 'toString', '__proto__']) {
    await page.goto('/studio/demos/' + slug)
    await expect(
      page.getByRole('heading', { name: 'Let’s get you back on track.' })
    ).toBeVisible()
  }
})
test('service discovery and studio options are selectable without audit', async ({
  page,
}) => {
  await page.goto('/blueprint')
  await expect(page.getByLabel('What can we help with?')).toHaveValue(
    'blueprint'
  )
  await page.goto('/studio/quote')
  await page.getByLabel('Project scope').selectOption('growth')
  await page.getByLabel('CRM integration', { exact: true }).check()
  await expect(
    page.getByLabel('CRM integration', { exact: true })
  ).toBeChecked()
  await page.goto('/contact')
  await expect(page.getByLabel('What can we help with?')).toHaveValue('contact')
})
test('light sections have dark keyboard focus indicators', async ({ page }) => {
  await page.goto('/')
  const link = page.locator('.light-section a')
  await link.focus()
  expect(await link.evaluate((el) => getComputedStyle(el).outlineColor)).toBe(
    'rgb(16, 35, 60)'
  )
})

test('preserved gallery theme controls remain operational', async ({
  page,
}) => {
  await page.goto('/components')
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await page.getByRole('menuitem', { name: 'Dark', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await page.getByRole('menuitem', { name: 'Light', exact: true }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})
