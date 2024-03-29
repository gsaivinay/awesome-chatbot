/** @type {import('prettier').Config} */
module.exports = {
    endOfLine: "lf",
    semi: true,
    useTabs: false,
    singleQuote: false,
    arrowParens: "avoid",
    tabWidth: 4,
    trailingComma: "all",
    // importOrder: [
    //     "^(react/(.*)$)|^(react$)",
    //     "^(next/(.*)$)|^(next$)",
    //     "<THIRD_PARTY_MODULES>",
    //     "",
    //     "^types$",
    //     "^@/types/(.*)$",
    //     "^@/config/(.*)$",
    //     "^@/lib/(.*)$",
    //     "^@/hooks/(.*)$",
    //     "^@/components/ui/(.*)$",
    //     "^@/components/(.*)$",
    //     "^@/registry/(.*)$",
    //     "^@/styles/(.*)$",
    //     "^@/app/(.*)$",
    //     "",
    //     "^[./]",
    // ],
    // importOrderSeparation: false,
    // importOrderSortSpecifiers: true,
    // importOrderBuiltinModulesToTop: true,
    // importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    // importOrderMergeDuplicateImports: true,
    // importOrderCombineTypeAndValueImports: true,
    printWidth: 120,
    // plugins: [
    //     require('prettier-plugin-organize-imports'),
    //     require('prettier-plugin-tailwindcss'),
    // ]
    "plugins": ["prettier-plugin-tailwindcss"]
};
