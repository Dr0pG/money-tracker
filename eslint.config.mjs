import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import reactNative from "eslint-plugin-react-native";
import _import from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "@react-native",
    "universe/native",
    "plugin:react-native/all",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "plugin:simple-import-sort/recommended",
)), {
    plugins: {
        "react-native": fixupPluginRules(reactNative),
        import: fixupPluginRules(_import),
        "simple-import-sort": fixupPluginRules(simpleImportSort),
    },

    settings: {
        "import/resolver": {
            "babel-module": {},
        },

        "babel-module": {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
    },

    rules: {
        "simple-import-sort/imports": ["error", {
            groups: [
                ["^react$", "^react-native$"],
                ["^expo", "^@?\\w"],
                ["^@/"],
                ["^\\./", "^\\.\\./"],
                ["^\\u0000"],
            ],
        }],

        "simple-import-sort/exports": "error",

        "sort-imports": ["error", {
            ignoreCase: true,
            ignoreDeclarationSort: true,
        }],

        "import/order": ["error", {
            groups: [["external", "builtin"], "internal", ["sibling", "parent"], "index"],

            pathGroups: [{
                pattern: "@(react|react-native)",
                group: "external",
                position: "before",
            }, {
                pattern: "@src/**",
                group: "internal",
            }],

            pathGroupsExcludedImportTypes: ["internal", "react"],
            "newlines-between": "always",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],
    },
}];