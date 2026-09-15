import { expect, test } from '@playwright/test';

test('Redux and React-only tabs exchange signals over WebSocket and recover history', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const sockets: string[] = [];
  page.on('websocket', socket => sockets.push(socket.url()));
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Signal Station.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Disconnect', exact: true }),
  ).toBeVisible();
  const peer = await context.newPage();
  peer.on('pageerror', error => errors.push(error.message));
  await peer.goto('/');
  await peer.getByRole('button', { name: /React only/ }).click();
  await expect(peer.getByRole('status')).toHaveText('Connected · 2 online');
  const first = `Do you copy? ${Date.now()}`;
  await page.getByLabel('Message', { exact: true }).fill(first);
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Delivered', { exact: true })).toBeVisible();
  await expect(peer.getByText(first, { exact: true })).toBeVisible();
  const reply = `Loud and clear ${Date.now()}`;
  await peer.getByLabel('Message', { exact: true }).fill(reply);
  await peer.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText(reply, { exact: true })).toBeVisible();
  await peer.getByRole('button', { name: 'Disconnect', exact: true }).click();
  await expect(
    peer.getByRole('button', { name: 'Send', exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole('status')).toHaveText('Connected · 1 online');
  const missed = `While you were offline ${Date.now()}`;
  await page.getByLabel('Message', { exact: true }).fill(missed);
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(peer.getByText(missed, { exact: true })).toHaveCount(0);
  await peer.getByRole('button', { name: 'Connect', exact: true }).click();
  await expect(peer.getByText(missed, { exact: true })).toBeVisible();
  for (const client of ['React only', 'Redux Toolkit', 'React only']) {
    await page.getByRole('button', { name: new RegExp(client) }).click();
    await expect(page.getByText(missed, { exact: true })).toHaveCount(1);
    await expect(page.getByRole('status')).toHaveText('Connected · 2 online');
  }
  await expect
    .poll(() =>
      sockets.some(
        url =>
          url.startsWith('ws://127.0.0.1:5173/socket.io/') &&
          url.includes('transport=websocket'),
      ),
    )
    .toBe(true);
  await page.screenshot({
    path: 'test-results/signal-station-desktop.png',
    fullPage: true,
  });
  await peer.close();
  await expect(page.getByRole('status')).toHaveText('Connected · 1 online');
  expect(errors).toEqual([]);
});

test('the tutorial and both client entries fit a mobile viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /React only/ }).click();
  await expect(
    page.getByRole('button', { name: 'Disconnect', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Make contact.' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: 'test-results/signal-station-mobile.png',
    fullPage: true,
  });
});
