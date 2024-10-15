import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config({
    files: ['**/*.ts'],
    ignores: ["lib/**/*", "generated/**/*"],
    plugins: {
      '@stylistic': stylistic
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      stylistic.configs['recommended-flat']
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigDirName: import.meta.dirname,
      },
    },
});