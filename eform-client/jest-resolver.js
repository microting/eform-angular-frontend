const {resolve: defaultResolve} = require('jest-resolve');

module.exports = (request, options) => {
  // Skip jest-preset-angular and jest modules
  if (request.startsWith('jest-preset-angular') || request.startsWith('jest-')) {
    return defaultResolve(request, options);
  }
  
  // Handle @angular/* and @ng-matero/* secondary entry points
  if (request.startsWith('@angular/') || request.startsWith('@ng-matero/')) {
    const parts = request.split('/');
    if (parts.length > 2) {
      // This is a secondary entry point like @angular/material/dialog
      const basePath = `${parts[0]}/${parts[1]}`;
      const subPath = parts.slice(2).join('/');
      try {
        return defaultResolve(`${basePath}/${subPath}`, options);
      } catch (e) {
        // Try finding it in the package exports
        try {
          const pkgPath = require.resolve(`${basePath}/package.json`, {
            paths: [options.basedir]
          });
          const pkg = require(pkgPath);
          const exports = pkg.exports?.[`./${subPath}`];
          if (exports) {
            const resolvedPath = exports.default || exports;
            if (typeof resolvedPath === 'string') {
              const fullPath = require.resolve(
                `${basePath}/${resolvedPath.replace('./', '')}`,
                {paths: [options.basedir]}
              );
              return fullPath;
            }
          }
        } catch (innerE) {
          // Fall through to default resolution
        }
      }
    }
  }
  
  // Default resolution
  return defaultResolve(request, options);
};
