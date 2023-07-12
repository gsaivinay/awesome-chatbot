/** @type {import('prettier').Config} */
module.exports = {
    tabWidth: 4,
    printWidth: 120,
    plugins: [
        require('prettier-plugin-organize-imports'),
        require('prettier-plugin-tailwindcss'),
    ]
}