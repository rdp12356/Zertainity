export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/integrations/supabase/client$': '<rootDir>/src/integrations/supabase/__mocks__/client.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
