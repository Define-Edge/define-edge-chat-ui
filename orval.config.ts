import { defineConfig } from 'orval';

export default defineConfig({
  'strategy-apis': {
    input: {
      target: './openapi-filtered.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/strategy-apis',
      schemas: './src/api/generated/strategy-apis/models',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
      clean: true,
      prettier: true,
      baseUrl: '/api/utilities',
      override: {
        useDates: false,
      },
    },
  },
});
