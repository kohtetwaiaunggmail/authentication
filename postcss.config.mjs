import { createRequire } from "node:module";
import { join } from "node:path";

// Resolve the plugin from this app's root package, even when Next is opened
// inside the parent learning workspace that has its own lockfile.
const require = createRequire(join(process.cwd(), "postcss.config.mjs"));
const tailwindPostcss = require.resolve("@tailwindcss/postcss");

const config = {
  plugins: {
    [tailwindPostcss]: {},
  },
};

export default config;
