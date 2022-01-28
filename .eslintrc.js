const jsonRules = {
    indent: [
        'error',
        4,
        {
            SwitchCase: 1
        }
    ]
};

const javascriptRules = {
    ...jsonRules,
    '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
                {
                    sourceTag: '*',
                    onlyDependOnLibsWithTags: ['*']
                }
            ]
        }
    ],
    'react/style-prop-object': 'off',
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'no-extra-semi': 'error',
    'no-unused-vars': ['error', { args: 'after-used' }],
    'semi': ['error', 'always']
};

const typescriptRules = {
    ...javascriptRules,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }]
};

module.exports = {
    root: true,
    ignorePatterns: ['**/*', '!*.js', '!*.json'],
    plugins: ['@nrwl/nx'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: ['plugin:@nrwl/nx/typescript'],
            rules: typescriptRules
        },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nrwl/nx/javascript'],
            rules: javascriptRules
        },
        {
            files: ['*.json'],
            extends: ['plugin:@nrwl/nx/javascript'],
            rules: jsonRules
        }
    ]
};