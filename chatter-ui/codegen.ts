
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  watch: true,
  documents: "src/**/*.ts",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      }
    }
  }
};

export default config;
