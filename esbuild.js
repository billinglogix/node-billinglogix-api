import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

build({
    entryPoints: ["./src/client.js"],
    outfile: "dist/cjs/index.cjs",
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: "node",
    format: "cjs",
    target: "node16",
    plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));

build({
    entryPoints: ["./src/client.js"],
    outfile: "dist/mjs/index.js",
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: "node",
    format: "esm",
    target: "node16",
    plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));
