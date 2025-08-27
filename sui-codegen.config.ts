import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "./src/generated",
  packages: [
    {
      package: "@local-pkg/bucket_v2_psm",
      packageName: "bucket_v2_psm",
      path: "./bucket_psm",
    },
  ],
};

export default config;
