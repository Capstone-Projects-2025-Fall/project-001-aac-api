import dts from "rollup-plugin-dts";

export default {
  input: "dist/types/index.d.ts", // tsc generated entry-point d.ts
  output: {
    file: "dist/AACommodateAPI.d.ts",
    format: "es"
  },
  plugins: [dts()]
};
