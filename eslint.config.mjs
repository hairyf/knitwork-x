// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    pnpm: true,
    ignores: ['README.md', 'docs/**/*.md', 'skills/**/*.md'],
    rules: {
      'no-template-curly-in-string': 'off',
      'ts/explicit-function-return-type': 'off',
    },
  },
)
