import { packageJs } from "./packageJs";

test("basic", async () => {
  const assets = [
    {
      protocol: "virtual",
      meta: {
        type: "js-module",
        id: `/test/index.js`,
        content: `const _add = require('./add')
const result = _add.add(1,2)`,
        directDependencies: [
          {
            protocol: "filesystem",
            meta: { importee: "./add.js" },
          },
        ],
        resolvedDirectDependencies: [
          {
            protocol: "filesystem",
            meta: { id: "/test/add.js" },
          },
        ],
      },
    },
    {
      protocol: "virtual",
      meta: {
        type: "js-module",
        id: "/test/add.js",
        content: "exports.add = (a,b) => a + b",
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ];
  const packaged = await packageJs(assets, "/test", assets[0].meta.id);
  const entry = packaged.find(
    (operation) => operation.destinationPath === "entry.js"
  );
  const modules = packaged.find(
    (operation) => operation.destinationPath === "modules.js"
  );
  const modulesMap = packaged.find(
    (operation) => operation.destinationPath === "modules.js.map"
  );
  expect(entry).toEqual({
    type: "write",
    destinationPath: "entry.js",
    content: `export const entry = "/test/index.js"`,
  });
  expect(modules).toEqual({
    type: "write",
    destinationPath: "modules.js",
    content: `export const modules = {
"/test/index.js": [(exports, require, module) => {
const _add = require('./add')
const result = _add.add(1,2)
},{"./add.js":"/test/add.js"}],
"/test/add.js": [(exports, require, module) => {
exports.add = (a,b) => a + b
},{}],

}
//# sourceMappingURL=./modules.js.map
`,
  });
  expect(modulesMap).toEqual({
    type: "write",
    destinationPath: "modules.js.map",
    content: `{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}`,
  });
});

test("empty file", async () => {
  const assets = [
    {
      protocol: "virtual",
      meta: {
        type: "js-module",
        id: "/test/index.js",
        content: "",
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ];
  const packaged = await packageJs(assets, "/test", assets[0].meta.id);
  const entry = packaged.find(
    (operation) => operation.destinationPath === "entry.js"
  );
  const modules = packaged.find(
    (operation) => operation.destinationPath === "modules.js"
  );
  const modulesMap = packaged.find(
    (operation) => operation.destinationPath === "modules.js.map"
  );
  expect(entry).toEqual({
    type: "write",
    destinationPath: "entry.js",
    content: `export const entry = "/test/index.js"`,
  });
  expect(modules).toEqual({
    type: "write",
    destinationPath: "modules.js",
    content: `export const modules = {
"/test/index.js": [(exports, require, module) => {

},{}],

}
//# sourceMappingURL=./modules.js.map
`,
  });
  expect(modulesMap).toEqual({
    type: "write",
    destinationPath: "modules.js.map",
    content: `{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}`,
  });
});
