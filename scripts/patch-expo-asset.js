const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '../node_modules/expo/node_modules/expo-asset/build/Asset.fx.js'),
  path.join(__dirname, '../node_modules/expo-asset/build/Asset.fx.js')
];

const patchContent = (content) => {
  let next = content;

  if (next.includes('setTransformer(function expoAssetTransformer')) {
    next = next.replace(
      /const setTransformer = resolveAssetSource\.setCustomSourceTransformer \|\| setCustomSourceTransformer;\n\s*setTransformer\(/,
      "const setTransformer = (resolveAssetSource && resolveAssetSource.setCustomSourceTransformer) || setCustomSourceTransformer;\n    if (typeof setTransformer === 'function') {\n      setTransformer("
    );
  }

  if (next.includes('setCustomSourceTransformer((resolver) => {')) {
    next = next.replace(
      /if \(IS_ENV_WITH_LOCAL_ASSETS\) \{\n\s*setCustomSourceTransformer\(/,
      "if (IS_ENV_WITH_LOCAL_ASSETS && typeof setCustomSourceTransformer === 'function') {\n    setCustomSourceTransformer("
    );
  }

  // Ensure braces close before source map.
  if (next.includes('//# sourceMappingURL=Asset.fx.js.map')) {
    const parts = next.split('//# sourceMappingURL=Asset.fx.js.map');
    let body = parts[0].trimEnd();
    if (!body.endsWith('}\n}') && !body.endsWith('}\n}\n')) {
      if (!body.endsWith('}')) {
        body += '\n    }';
      }
      body += '\n}';
    }
    next = body + '\n//# sourceMappingURL=Asset.fx.js.map' + (parts[1] || '');
  }

  return next;
};

for (const file of targets) {
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  const patched = patchContent(original);
  if (patched !== original) {
    fs.writeFileSync(file, patched, 'utf8');
    console.log('Patched', file);
  }
}
