const Module = require("module");
const path = require("path");

const original = Module._resolveFilename;
const stub = path.join(__dirname, "empty-server-only.cjs");

Module._resolveFilename = function resolveServerOnly(request, parent, isMain, options) {
  if (request === "server-only") {
    return stub;
  }
  return original.call(this, request, parent, isMain, options);
};
