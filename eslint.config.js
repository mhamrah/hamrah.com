import ts from 'typescript-eslint';
import parser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'node_modules/**',
			'.svelte-kit/**',
			'build/**',
			'.wrangler/**',
			'test-results/**',
			'playwright-report/**'
		]
	},
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{ files: ['**/*.svelte'], languageOptions: { parserOptions: { parser } } },
	prettier
];
