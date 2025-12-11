const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const version = pkg.version || '0.0.0';

const out = `
/* This file is generated — do not edit */
export const APP_VERSION = '${version}';
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'version.ts'), out);
console.log('Wrote src/lib/version.ts', version);