import { test, expect, type Page } from '@playwright/test'
import { PLATFORM_ON, ROUTES } from './routes'

/**
 * The look and the motion, checked in a real browser on every route:
 *
 * - no grid texture anywhere (no tiled hairline background, no SVG pattern);
 * - every product screenshot sits in its own liquid-glass pane;
 * - the tagline is display-size type, the largest on the homepage;
 * - Lenis drives the scroll, and stands down under reduced motion;
 * - a client navigation runs a view transition, with the header held still.
 *
 * Runs in both flag states; the tagline check follows whichever homepage the
 * server was built with.
 */

/** A visit with the consent choice already made, so no banner covers the page. */
async function open(page: Page, baseURL: string | undefined, path: string) {
  await page.context().addCookies([
    {
      name: 'jobsafe_consent',
      value: encodeURIComponent(JSON.stringify({ version: 1, at: new Date().toISOString(), analytics: false, marketing: false })),
      url: baseURL ?? 'http://localhost:3000',
    },
  ])
  await page.goto(path, { waitUntil: 'networkidle' })
}

/** Product screenshots: the platform captures, the phone screens and the hero duo. */
const PRODUCT_SHOT = /%2Fproduct%2F|\/product\/|%2Fimages%2Fscreens%2F|\/images\/screens\/|jobsafe-hero-duo/

test.describe('no grid, product shots in glass', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  for (const route of ROUTES) {
    test(`${route}`, async ({ page, baseURL }) => {
      await open(page, baseURL, route)
      const report = await page.evaluate((source) => {
        const shot = new RegExp(source)
        const tiled = [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => {
            const style = getComputedStyle(el)
            return style.backgroundImage.includes('linear-gradient') && /\d+px \d+px/.test(style.backgroundSize)
          })
          .map((el) => el.className.toString().slice(0, 80))
        const patterns = document.querySelectorAll('svg pattern').length
        const shots = [...document.querySelectorAll('img')].filter((img) => shot.test(img.currentSrc || img.src))
        const unframed = shots.filter((img) => !img.closest('.liquid-glass')).map((img) => img.alt.slice(0, 60))
        return { tiled, patterns, shots: shots.length, unframed }
      }, PRODUCT_SHOT.source)
      expect(report.tiled, 'tiled grid backgrounds').toEqual([])
      expect(report.patterns, 'SVG grid patterns').toBe(0)
      expect(report.unframed, 'product screenshots outside a liquid-glass pane').toEqual([])
    })
  }
})

test.describe('the tagline', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('is set large on the homepage, with Resolve in crimson', async ({ page, baseURL }) => {
    await open(page, baseURL, '/')
    const tagline = page.locator(PLATFORM_ON ? '#hero .type-tagline-inline' : '#hero h1.type-tagline')
    await expect(tagline).toHaveText('Record. Resolve. Prevent.')
    const size = await tagline.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    // Phase 1: the H1 itself, well past the 68px display size. Phase 2: the
    // line above the H1, four times the 12px eyebrow it replaced.
    expect(size).toBeGreaterThanOrEqual(PLATFORM_ON ? 48 : 110)
    // The middle word is the brand crimson, resolved from the token in the page.
    const [word, brand] = await tagline.getByText('Resolve.', { exact: true }).evaluate((el) => {
      const probe = document.createElement('span')
      probe.style.color = 'var(--color-brand)'
      document.body.append(probe)
      const resolved = getComputedStyle(probe).color
      probe.remove()
      return [getComputedStyle(el).color, resolved]
    })
    expect(word).toBe(brand)
  })
})

test.describe('smooth scroll', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('Lenis eases a wheel scroll instead of jumping', async ({ page, baseURL }) => {
    await open(page, baseURL, '/')
    await expect(page.locator('html')).toHaveClass(/\blenis\b/)
    await page.mouse.move(640, 450)
    await page.mouse.wheel(0, 800)
    const first = await page.evaluate(() => window.scrollY)
    await page.waitForTimeout(900)
    const settled = await page.evaluate(() => window.scrollY)
    expect(first).toBeLessThan(settled)
    expect(settled).toBeGreaterThan(600)
  })

  test('stands down under reduced motion', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })
    const page = await context.newPage()
    await open(page, baseURL, '/')
    await page.waitForTimeout(500)
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/)
    expect(await page.locator('main').evaluate((el) => el.getAnimations().length)).toBe(0)
    await context.close()
  })
})

test.describe('page transitions', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('a client navigation runs a view transition with the header held still', async ({ page, baseURL }) => {
    await open(page, baseURL, '/')
    await page.evaluate(() => {
      const w = window as unknown as { __vt: string[] }
      w.__vt = []
      const start = document.startViewTransition.bind(document)
      document.startViewTransition = ((...args: Parameters<typeof start>) => {
        const transition = start(...args)
        transition.ready
          .then(() => {
            w.__vt = document
              .getAnimations()
              .map((a) => (a as CSSAnimation).animationName)
              .filter(Boolean)
          })
          .catch(() => {})
        return transition
      }) as typeof document.startViewTransition
    })
    // A top-level header link in each flag state (Insights sits in a mega-menu with the flag on).
    const target = PLATFORM_ON ? '/pricing' : '/insights'
    await page.locator(`header a[href="${target}"]`).first().click()
    await page.waitForURL(`**${target}`)
    await expect.poll(() => page.evaluate(() => (window as unknown as { __vt: string[] }).__vt)).toEqual(expect.arrayContaining(['page-out', 'page-in']))
    expect(await page.locator('header').first().evaluate((el) => getComputedStyle(el).viewTransitionName)).toBe('site-header')
    // The first-paint animation does not replay under the transition.
    expect(await page.locator('main').evaluate((el) => el.getAnimations().length)).toBe(0)
  })
})
