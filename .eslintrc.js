module.exports = {
    extends: [
        'eslint-config-react-app',
        "plugin:react-hooks/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
      "react-hooks"
    ],
}
