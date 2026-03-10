const prettierConfig = {
  singleQuote: false,
  semi: true,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,

  plugins: ["@trivago/prettier-plugin-sort-imports"],

  importOrder: ["^react$", "^next", "<THIRD_PARTY_MODULES>", "^@/", "^[./]"],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default prettierConfig;
