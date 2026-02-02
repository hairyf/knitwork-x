import { describe, expect, it } from 'vitest'
import { genAugmentation, genInterface, genModule } from '../src'
import { genTestTitle } from './_utils'

const genAugmentationTests: Array<{
  input: Parameters<typeof genAugmentation>
  code: string
}> = [
  { input: ['@nuxt/utils'], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ['@nuxt/utils', genInterface('MyInterface', {})],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
  {
    input: [
      '@nuxt/utils',
      [genInterface('MyInterface', {}), genInterface('MyOtherInterface', {})],
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: ['@nuxt/utils', genInterface('MyInterface', { 'test?': 'string' })],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
}`,
  },
  {
    input: [
      '@nuxt/utils',
      genInterface(
        'MyInterface',
        {},
        { extends: ['OtherInterface', 'FurtherInterface'] },
      ),
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
}`,
  },
  {
    input: ['@nuxt/utils', ['interface Foo {}', 'type Bar = string']],
    code: `declare module "@nuxt/utils" {
  interface Foo {}
  type Bar = string
}`,
  },
]

describe('genAugmentation', () => {
  for (const t of genAugmentationTests) {
    it(genTestTitle(t.code), () => {
      const code = genAugmentation(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genModuleTests: Array<{
  input: Parameters<typeof genModule>
  code: string
}> = [
  { input: ['@nuxt/utils'], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ['@nuxt/utils', genInterface('MyInterface', {})],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
]

describe('genModule', () => {
  for (const t of genModuleTests) {
    it(genTestTitle(t.code), () => {
      const code = genModule(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
