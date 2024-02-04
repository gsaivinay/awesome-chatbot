import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    preset: "ts-jest",
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.js?$': 'ts-jest',
    },
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    coverageReporters: ["html", "lcov"],
    collectCoverageFrom: ["src/**/*.tsx", "src/**/*.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};

const esmModules = ["nanoid"];

async function jestConfig() {
    const nextJestConfig = await createJestConfig(config)();
    nextJestConfig.transformIgnorePatterns = [`node_modules/(?!(?:.pnpm/)?(${esmModules.join("|")}))`];
    return nextJestConfig;
}

export default jestConfig;
