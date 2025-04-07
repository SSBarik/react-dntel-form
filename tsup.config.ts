import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  watch: process.env.WATCH === "true",
  esbuildPlugins: [
    {
      name: "tailwind-css",
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
          return {
            loader: "css",
            contents: await require("fs").promises.readFile(args.path, "utf8"),
          };
        });
      },
    },
  ],
});
