'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.isAbsolute = isAbsolute;
exports.isBuiltIn = isBuiltIn;
exports.isExternalModule = isExternalModule;
exports.isExternalModuleMain = isExternalModuleMain;
exports.isScoped = isScoped;
exports.isScopedMain = isScopedMain;
exports.isScopedModule = isScopedModule;
exports.default = resolveImportType;

var _core = require('resolve/lib/core');

var _core2 = _interopRequireDefault(_core);

var _resolve = require('eslint-module-utils/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function baseModule(name) {
  if (isScoped(name)) {
    var _name$split = name.split('/'),
        _name$split2 = _slicedToArray(_name$split, 2);

    const scope = _name$split2[0],
          pkg = _name$split2[1];

    return `${scope}/${pkg}`;
  }

  var _name$split3 = name.split('/'),
      _name$split4 = _slicedToArray(_name$split3, 1);

  const pkg = _name$split4[0];

  return pkg;
}

function isAbsolute(name) {
  return name.indexOf('/') === 0;
}

// path is defined only when a resolver resolves to a non-standard path
function isBuiltIn(name, settings, path) {
  if (path) return false;
  const base = baseModule(name);
  const extras = settings && settings['import/core-modules'] || [];
  return _core2.default[base] || extras.indexOf(base) > -1;
}

function isExternalPath(path, name, settings) {
  const folders = settings && settings['import/external-module-folders'] || ['node_modules'];
  return !path || folders.some(folder => isSubpath(folder, path));
}

function isSubpath(subpath, path) {
  const normSubpath = subpath.replace(/[/]$/, '');
  if (normSubpath.length === 0) {
    return false;
  }
  const left = path.indexOf(normSubpath);
  const right = left + normSubpath.length;
  return left !== -1 && (left === 0 || normSubpath[0] !== '/' && path[left - 1] === '/') && (right >= path.length || path[right] === '/');
}

const externalModuleRegExp = /^\w/;
function isExternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && isExternalPath(path, name, settings);
}

const externalModuleMainRegExp = /^[\w]((?!\/).)*$/;
function isExternalModuleMain(name, settings, path) {
  return externalModuleMainRegExp.test(name) && isExternalPath(path, name, settings);
}

const scopedRegExp = /^@[^/]+\/?[^/]+/;
function isScoped(name) {
  return scopedRegExp.test(name);
}

const scopedMainRegExp = /^@[^/]+\/?[^/]+$/;
function isScopedMain(name) {
  return scopedMainRegExp.test(name);
}

function isInternalModule(name, settings, path) {
  const internalScope = settings && settings['import/internal-regex'];
  const matchesScopedOrExternalRegExp = scopedRegExp.test(name) || externalModuleRegExp.test(name);
  return matchesScopedOrExternalRegExp && (internalScope && new RegExp(internalScope).test(name) || !isExternalPath(path, name, settings));
}

function isRelativeToParent(name) {
  return (/^\.\.[\\/]/.test(name)
  );
}

const indexFiles = ['.', './', './index', './index.js'];
function isIndex(name) {
  return indexFiles.indexOf(name) !== -1;
}

function isRelativeToSibling(name) {
  return (/^\.[\\/]/.test(name)
  );
}

function typeTest(name, settings, path) {
  if (isAbsolute(name, settings, path)) {
    return 'absolute';
  }
  if (isBuiltIn(name, settings, path)) {
    return 'builtin';
  }
  if (isInternalModule(name, settings, path)) {
    return 'internal';
  }
  if (isExternalModule(name, settings, path)) {
    return 'external';
  }
  if (isScoped(name, settings, path)) {
    return 'external';
  }
  if (isRelativeToParent(name, settings, path)) {
    return 'parent';
  }
  if (isIndex(name, settings, path)) {
    return 'index';
  }
  if (isRelativeToSibling(name, settings, path)) {
    return 'sibling';
  }
  return 'unknown';
}

function isScopedModule(name) {
  return name.indexOf('@') === 0;
}

function resolveImportType(name, context) {
  return typeTest(name, context.settings, (0, _resolve2.default)(name, context));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2ltcG9ydFR5cGUuanMiXSwibmFtZXMiOlsiaXNBYnNvbHV0ZSIsImlzQnVpbHRJbiIsImlzRXh0ZXJuYWxNb2R1bGUiLCJpc0V4dGVybmFsTW9kdWxlTWFpbiIsImlzU2NvcGVkIiwiaXNTY29wZWRNYWluIiwiaXNTY29wZWRNb2R1bGUiLCJyZXNvbHZlSW1wb3J0VHlwZSIsImJhc2VNb2R1bGUiLCJuYW1lIiwic3BsaXQiLCJzY29wZSIsInBrZyIsImluZGV4T2YiLCJzZXR0aW5ncyIsInBhdGgiLCJiYXNlIiwiZXh0cmFzIiwiY29yZU1vZHVsZXMiLCJpc0V4dGVybmFsUGF0aCIsImZvbGRlcnMiLCJzb21lIiwiZm9sZGVyIiwiaXNTdWJwYXRoIiwic3VicGF0aCIsIm5vcm1TdWJwYXRoIiwicmVwbGFjZSIsImxlbmd0aCIsImxlZnQiLCJyaWdodCIsImV4dGVybmFsTW9kdWxlUmVnRXhwIiwidGVzdCIsImV4dGVybmFsTW9kdWxlTWFpblJlZ0V4cCIsInNjb3BlZFJlZ0V4cCIsInNjb3BlZE1haW5SZWdFeHAiLCJpc0ludGVybmFsTW9kdWxlIiwiaW50ZXJuYWxTY29wZSIsIm1hdGNoZXNTY29wZWRPckV4dGVybmFsUmVnRXhwIiwiUmVnRXhwIiwiaXNSZWxhdGl2ZVRvUGFyZW50IiwiaW5kZXhGaWxlcyIsImlzSW5kZXgiLCJpc1JlbGF0aXZlVG9TaWJsaW5nIiwidHlwZVRlc3QiLCJjb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQWFnQkEsVSxHQUFBQSxVO1FBS0FDLFMsR0FBQUEsUztRQXlCQUMsZ0IsR0FBQUEsZ0I7UUFLQUMsb0IsR0FBQUEsb0I7UUFLQUMsUSxHQUFBQSxRO1FBS0FDLFksR0FBQUEsWTtRQW1DQUMsYyxHQUFBQSxjO2tCQUlRQyxpQjs7QUFqR3hCOzs7O0FBRUE7Ozs7OztBQUVBLFNBQVNDLFVBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQ3hCLE1BQUlMLFNBQVNLLElBQVQsQ0FBSixFQUFv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LElBQWpCLEVBQXVCSyxRQUF2QixFQUFpQ0MsSUFBakMsQ0FBSixFQUE0QztBQUFFLFdBQU8sVUFBUDtBQUFtQjtBQUNqRSxNQUFJYixpQkFBaUJPLElBQWpCLEVBQXVCSyxRQUF2QixFQUFpQ0MsSUFBakMsQ0FBSixFQUE0QztBQUFFLFdBQU8sVUFBUDtBQUFtQjtBQUNqRSxNQUFJWCxTQUFTSyxJQUFULEVBQWVLLFFBQWYsRUFBeUJDLElBQXpCLENBQUosRUFBb0M7QUFBRSxXQUFPLFVBQVA7QUFBbUI7QUFDekQsTUFBSXdCLG1CQUFtQjlCLElBQW5CLEVBQXlCSyxRQUF6QixFQUFtQ0MsSUFBbkMsQ0FBSixFQUE4QztBQUFFLFdBQU8sUUFBUDtBQUFpQjtBQUNqRSxNQUFJMEIsUUFBUWhDLElBQVIsRUFBY0ssUUFBZCxFQUF3QkMsSUFBeEIsQ0FBSixFQUFtQztBQUFFLFdBQU8sT0FBUDtBQUFnQjtBQUNyRCxNQUFJMkIsb0JBQW9CakMsSUFBcEIsRUFBMEJLLFFBQTFCLEVBQW9DQyxJQUFwQyxDQUFKLEVBQStDO0FBQUUsV0FBTyxTQUFQO0FBQWtCO0FBQ25FLFNBQU8sU0FBUDtBQUNEOztBQUVNLFNBQVNULGNBQVQsQ0FBd0JHLElBQXhCLEVBQThCO0FBQ25DLFNBQU9BLEtBQUtJLE9BQUwsQ0FBYSxHQUFiLE1BQXNCLENBQTdCO0FBQ0Q7O0FBRWMsU0FBU04saUJBQVQsQ0FBMkJFLElBQTNCLEVBQWlDbUMsT0FBakMsRUFBMEM7QUFDdkQsU0FBT0QsU0FBU2xDLElBQVQsRUFBZW1DLFFBQVE5QixRQUF2QixFQUFpQyx1QkFBUUwsSUFBUixFQUFjbUMsT0FBZCxDQUFqQyxDQUFQO0FBQ0QiLCJmaWxlIjoiaW1wb3J0VHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb3JlTW9kdWxlcyBmcm9tICdyZXNvbHZlL2xpYi9jb3JlJ1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnXG5cbmZ1bmN0aW9uIGJhc2VNb2R1bGUobmFtZSkge1xuICBpZiAoaXNTY29wZWQobmFtZSkpIHtcbiAgICBjb25zdCBbc2NvcGUsIHBrZ10gPSBuYW1lLnNwbGl0KCcvJylcbiAgICByZXR1cm4gYCR7c2NvcGV9LyR7cGtnfWBcbiAgfVxuICBjb25zdCBbcGtnXSA9IG5hbWUuc3BsaXQoJy8nKVxuICByZXR1cm4gcGtnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fic29sdXRlKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUuaW5kZXhPZignLycpID09PSAwXG59XG5cbi8vIHBhdGggaXMgZGVmaW5lZCBvbmx5IHdoZW4gYSByZXNvbHZlciByZXNvbHZlcyB0byBhIG5vbi1zdGFuZGFyZCBwYXRoXG5leHBvcnQgZnVuY3Rpb24gaXNCdWlsdEluKG5hbWUsIHNldHRpbmdzLCBwYXRoKSB7XG4gIGlmIChwYXRoKSByZXR1cm4gZmFsc2VcbiAgY29uc3QgYmFzZSA9IGJhc2VNb2R1bGUobmFtZSlcbiAgY29uc3QgZXh0cmFzID0gKHNldHRpbmdzICYmIHNldHRpbmdzWydpbXBvcnQvY29yZS1tb2R1bGVzJ10pIHx8IFtdXG4gIHJldHVybiBjb3JlTW9kdWxlc1tiYXNlXSB8fCBleHRyYXMuaW5kZXhPZihiYXNlKSA+IC0xXG59XG5cbmZ1bmN0aW9uIGlzRXh0ZXJuYWxQYXRoKHBhdGgsIG5hbWUsIHNldHRpbmdzKSB7XG4gIGNvbnN0IGZvbGRlcnMgPSAoc2V0dGluZ3MgJiYgc2V0dGluZ3NbJ2ltcG9ydC9leHRlcm5hbC1tb2R1bGUtZm9sZGVycyddKSB8fCBbJ25vZGVfbW9kdWxlcyddXG4gIHJldHVybiAhcGF0aCB8fCBmb2xkZXJzLnNvbWUoZm9sZGVyID0+IGlzU3VicGF0aChmb2xkZXIsIHBhdGgpKVxufVxuXG5mdW5jdGlvbiBpc1N1YnBhdGgoc3VicGF0aCwgcGF0aCkge1xuICBjb25zdCBub3JtU3VicGF0aCA9IHN1YnBhdGgucmVwbGFjZSgvWy9dJC8sICcnKVxuICBpZiAobm9ybVN1YnBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgY29uc3QgbGVmdCA9IHBhdGguaW5kZXhPZihub3JtU3VicGF0aClcbiAgY29uc3QgcmlnaHQgPSBsZWZ0ICsgbm9ybVN1YnBhdGgubGVuZ3RoXG4gIHJldHVybiBsZWZ0ICE9PSAtMSAmJlxuICAgICAgICAobGVmdCA9PT0gMCB8fCBub3JtU3VicGF0aFswXSAhPT0gJy8nICYmIHBhdGhbbGVmdCAtIDFdID09PSAnLycpICYmXG4gICAgICAgIChyaWdodCA+PSBwYXRoLmxlbmd0aCB8fCBwYXRoW3JpZ2h0XSA9PT0gJy8nKVxufVxuXG5jb25zdCBleHRlcm5hbE1vZHVsZVJlZ0V4cCA9IC9eXFx3L1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXh0ZXJuYWxNb2R1bGUobmFtZSwgc2V0dGluZ3MsIHBhdGgpIHtcbiAgcmV0dXJuIGV4dGVybmFsTW9kdWxlUmVnRXhwLnRlc3QobmFtZSkgJiYgaXNFeHRlcm5hbFBhdGgocGF0aCwgbmFtZSwgc2V0dGluZ3MpXG59XG5cbmNvbnN0IGV4dGVybmFsTW9kdWxlTWFpblJlZ0V4cCA9IC9eW1xcd10oKD8hXFwvKS4pKiQvXG5leHBvcnQgZnVuY3Rpb24gaXNFeHRlcm5hbE1vZHVsZU1haW4obmFtZSwgc2V0dGluZ3MsIHBhdGgpIHtcbiAgcmV0dXJuIGV4dGVybmFsTW9kdWxlTWFpblJlZ0V4cC50ZXN0KG5hbWUpICYmIGlzRXh0ZXJuYWxQYXRoKHBhdGgsIG5hbWUsIHNldHRpbmdzKVxufVxuXG5jb25zdCBzY29wZWRSZWdFeHAgPSAvXkBbXi9dK1xcLz9bXi9dKy9cbmV4cG9ydCBmdW5jdGlvbiBpc1Njb3BlZChuYW1lKSB7XG4gIHJldHVybiBzY29wZWRSZWdFeHAudGVzdChuYW1lKVxufVxuXG5jb25zdCBzY29wZWRNYWluUmVnRXhwID0gL15AW14vXStcXC8/W14vXSskL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NvcGVkTWFpbihuYW1lKSB7XG4gIHJldHVybiBzY29wZWRNYWluUmVnRXhwLnRlc3QobmFtZSlcbn1cblxuZnVuY3Rpb24gaXNJbnRlcm5hbE1vZHVsZShuYW1lLCBzZXR0aW5ncywgcGF0aCkge1xuICBjb25zdCBpbnRlcm5hbFNjb3BlID0gKHNldHRpbmdzICYmIHNldHRpbmdzWydpbXBvcnQvaW50ZXJuYWwtcmVnZXgnXSlcbiAgY29uc3QgbWF0Y2hlc1Njb3BlZE9yRXh0ZXJuYWxSZWdFeHAgPSBzY29wZWRSZWdFeHAudGVzdChuYW1lKSB8fCBleHRlcm5hbE1vZHVsZVJlZ0V4cC50ZXN0KG5hbWUpXG4gIHJldHVybiAobWF0Y2hlc1Njb3BlZE9yRXh0ZXJuYWxSZWdFeHAgJiYgKGludGVybmFsU2NvcGUgJiYgbmV3IFJlZ0V4cChpbnRlcm5hbFNjb3BlKS50ZXN0KG5hbWUpIHx8ICFpc0V4dGVybmFsUGF0aChwYXRoLCBuYW1lLCBzZXR0aW5ncykpKVxufVxuXG5mdW5jdGlvbiBpc1JlbGF0aXZlVG9QYXJlbnQobmFtZSkge1xuICByZXR1cm4gL15cXC5cXC5bXFxcXC9dLy50ZXN0KG5hbWUpXG59XG5cbmNvbnN0IGluZGV4RmlsZXMgPSBbJy4nLCAnLi8nLCAnLi9pbmRleCcsICcuL2luZGV4LmpzJ11cbmZ1bmN0aW9uIGlzSW5kZXgobmFtZSkge1xuICByZXR1cm4gaW5kZXhGaWxlcy5pbmRleE9mKG5hbWUpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBpc1JlbGF0aXZlVG9TaWJsaW5nKG5hbWUpIHtcbiAgcmV0dXJuIC9eXFwuW1xcXFwvXS8udGVzdChuYW1lKVxufVxuXG5mdW5jdGlvbiB0eXBlVGVzdChuYW1lLCBzZXR0aW5ncywgcGF0aCkge1xuICBpZiAoaXNBYnNvbHV0ZShuYW1lLCBzZXR0aW5ncywgcGF0aCkpIHsgcmV0dXJuICdhYnNvbHV0ZScgfVxuICBpZiAoaXNCdWlsdEluKG5hbWUsIHNldHRpbmdzLCBwYXRoKSkgeyByZXR1cm4gJ2J1aWx0aW4nIH1cbiAgaWYgKGlzSW50ZXJuYWxNb2R1bGUobmFtZSwgc2V0dGluZ3MsIHBhdGgpKSB7IHJldHVybiAnaW50ZXJuYWwnIH1cbiAgaWYgKGlzRXh0ZXJuYWxNb2R1bGUobmFtZSwgc2V0dGluZ3MsIHBhdGgpKSB7IHJldHVybiAnZXh0ZXJuYWwnIH1cbiAgaWYgKGlzU2NvcGVkKG5hbWUsIHNldHRpbmdzLCBwYXRoKSkgeyByZXR1cm4gJ2V4dGVybmFsJyB9XG4gIGlmIChpc1JlbGF0aXZlVG9QYXJlbnQobmFtZSwgc2V0dGluZ3MsIHBhdGgpKSB7IHJldHVybiAncGFyZW50JyB9XG4gIGlmIChpc0luZGV4KG5hbWUsIHNldHRpbmdzLCBwYXRoKSkgeyByZXR1cm4gJ2luZGV4JyB9XG4gIGlmIChpc1JlbGF0aXZlVG9TaWJsaW5nKG5hbWUsIHNldHRpbmdzLCBwYXRoKSkgeyByZXR1cm4gJ3NpYmxpbmcnIH1cbiAgcmV0dXJuICd1bmtub3duJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTY29wZWRNb2R1bGUobmFtZSkge1xuICByZXR1cm4gbmFtZS5pbmRleE9mKCdAJykgPT09IDBcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZUltcG9ydFR5cGUobmFtZSwgY29udGV4dCkge1xuICByZXR1cm4gdHlwZVRlc3QobmFtZSwgY29udGV4dC5zZXR0aW5ncywgcmVzb2x2ZShuYW1lLCBjb250ZXh0KSlcbn1cbiJdfQ==