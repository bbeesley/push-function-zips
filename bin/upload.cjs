#!/usr/bin/env node

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  try {
    await import('./upload.mjs');
  } catch (error) {
    console.error({ error });
    process.exit(1);
  }
})();
