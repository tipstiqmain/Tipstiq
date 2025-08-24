const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./purchase/app.js'],
  bundle: true,
  outfile: './purchase/bundle.js',
  platform: 'browser',
  format: 'iife',
  globalName: 'PurchaseApp',
}).catch(() => process.exit(1));