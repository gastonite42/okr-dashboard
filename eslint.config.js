import js from '@eslint/js'
import globals from 'globals'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { importX as importPlugin } from 'eslint-plugin-import-x'
import nodePlugin from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

const files = ['**/*.{ts,tsx}']

const noPropertyValueNewlineRule = {
  meta: {
    type: 'layout',
    docs: { description: 'Disallow property values on a new line after the colon' },
    messages: { noNewline: 'Property value must be on the same line as the colon.' },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode
    return {
      Property(node) {
        const colonToken = sourceCode.getTokenAfter(node.key, token => token.value === ':')
        if (!colonToken)
          return
        const firstTokenAfterColon = sourceCode.getTokenAfter(colonToken)
        if (!firstTokenAfterColon)
          return
        if (firstTokenAfterColon.loc.start.line > colonToken.loc.end.line) {
          context.report({
            node,
            messageId: 'noNewline',
            fix(fixer) {
              return fixer.replaceTextRange(
                [colonToken.range[1], firstTokenAfterColon.range[0]],
                ' ',
              )
            },
          })
        }
      },
    }
  },
}

export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  stylistic.configs['disable-legacy'],
  { files: ['**/*.js'], ...tseslint.configs.disableTypeChecked },
  reactPlugin.configs.flat.all,

  // --- Import ---
  {
    files,
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json',
        }),
      ],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
        warnOnUnassignedImports: false,
      }],
      'import/newline-after-import': ['error', { count: 3 }],
      'import/no-duplicates': ['error', { 'prefer-inline': false, considerQueryString: true }],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/extensions': 'off',
      'import/no-unused-modules': 'off',
      'import/no-unresolved': ['error', { caseSensitive: true, commonjs: true, amd: false }],
      'import/no-default-export': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-named-default': 'error',
      'import/no-mutable-exports': 'off',
      'import/no-named-export': 'off',
      'import/exports-last': 'off',
      'import/group-exports': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
        includeTypes: true,
      }],
      'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
      'import/no-commonjs': 'error',
      'import/no-amd': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-namespace': 'error',
      'import/no-relative-parent-imports': 'off',
      'import/no-relative-packages': 'error',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/first': 'error',
      'import/no-import-module-exports': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-deprecated': 'warn',
      'import/max-dependencies': 'off',
      'import/dynamic-import-chunkname': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },

  // Allow default exports in config files and App root
  {
    files: ['**/*.config.ts', '**/*.config.js', '**/App.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // --- Node ---
  {
    files,
    plugins: { node: nodePlugin },
    rules: {
      'node/prefer-node-protocol': 'error',
    },
  },

  // --- Perfectionist ---
  {
    files,
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-jsx-props': ['error', {
        type: 'unsorted',
        groups: ['reserved', 'unknown', 'shorthand-prop', 'callback'],
        customGroups: [
          { groupName: 'reserved', elementNamePattern: '^(key|ref)$' },
          { groupName: 'callback', elementNamePattern: '^on[A-Z].+' },
        ],
      }],
    },
  },

  // --- Custom rule ---
  {
    files,
    plugins: {
      custom: { rules: { 'no-property-value-newline': noPropertyValueNewlineRule } },
    },
    rules: {
      'custom/no-property-value-newline': 'error',
    },
  },

  // --- Main config ---
  {
    files,
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // --- JS ---
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      'no-debugger': 'error',
      'no-implicit-globals': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="Object"][callee.property.name="assign"]',
          message: 'Use spread instead of Object.assign()',
        },
        {
          selector: 'ExportNamedDeclaration:not([declaration]):not([source])',
          message: 'Use inline named exports (export const X = ...) instead of export { X }',
        },
      ],

      // --- TS ---
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'typeParameter',
        format: ['PascalCase'],
        custom: { regex: '^(T|T[A-Z][A-Za-z]+)$', match: true },
      }],
      indent: 'off',
      '@typescript-eslint/indent': 'off',

      // --- React ---
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-no-literals': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-max-depth': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/forbid-component-props': 'off',
      'react/no-children-prop': 'off',
      'react/prefer-read-only-props': 'off',
      'react/require-default-props': 'off',
      'react/no-multi-comp': 'off',
      'react/no-unescaped-entities': 'off',
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      // Handled by @stylistic / perfectionist
      'react/jsx-sort-props': 'off',
      'react/jsx-newline': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-closing-tag-location': 'off',
      'react/jsx-child-element-spacing': 'off',

      // --- Stylistic ---
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: 'always' }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXAttribute[name.name="className"] TemplateLiteral *',
        ],
      }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        importAttributes: 'always-multiline',
        dynamicImports: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: true }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 3, maxEOF: 0 }],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'none' },
        singleline: { delimiter: 'semi', requireLast: false },
        multilineDetection: 'brackets',
      }],
      '@stylistic/quote-props': ['error', 'as-needed', { numbers: true }],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/nonblock-statement-body-position': ['error', 'below'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/padded-blocks': ['error', 'start'],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-element-newline': ['error', { ArrayExpression: 'consistent' }],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/no-extra-parens': 'off',
      '@stylistic/operator-linebreak': ['error', 'none', {
        overrides: { '?': 'ignore', ':': 'ignore', '&&': 'ignore', '||': 'ignore', '??': 'ignore' },
      }],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      '@stylistic/newline-per-chained-call': 'off',
      '@stylistic/multiline-comment-style': 'off',
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-indent-props': ['error', { indentMode: 2, ignoreTernaryOperator: false }],
      '@stylistic/jsx-closing-bracket-location': ['error'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-newline': ['error', { prevent: true, allowMultilines: true }],
      '@stylistic/jsx-child-element-spacing': 'off',
      '@stylistic/jsx-sort-props': 'off',
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'literal' }],
      '@stylistic/jsx-max-props-per-line': ['error', { when: 'multiline', maximum: 1 }],
      '@stylistic/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],
    },
  },
])
