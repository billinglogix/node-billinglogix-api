const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

esbuild
    .build({
        entryPoints: ["./src/index.js"],
        outfile: "dist/cjs/index.js",
        bundle: true,
        minify: true,
        treeShaking: true,
        platform: "node",
        format: "cjs",
        target: "node16",
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));

esbuild
    .build({
        entryPoints: ["./src/index.js"],
        outfile: "dist/mjs/index.js",
        bundle: true,
        minify: true,
        treeShaking: true,
        platform: "node",
        format: "esm",
        target: "node16",
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));
