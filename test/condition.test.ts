import type { GenElseOptions } from '../src'
import { describe, expect, it } from 'vitest'
import {
  genElse,
  genElseIf,
  genIf,
  genPrefixedBlock,
  genTernary,
} from '../src'
import { genTestTitle } from './_utils'

const genPrefixedBlockTests: Array<{
  input: Parameters<typeof genPrefixedBlock>
  code: string
}> = [
  {
    input: ['if (ok)', 'return true;'],
    code: `if (ok) {
  return true;
}`,
  },
  {
    input: ['while (running)', ['step();', 'check();']],
    code: `while (running) {
  step();
  check();
}`,
  },
]
describe('genPrefixedBlock', () => {
  for (const t of genPrefixedBlockTests) {
    it(genTestTitle(t.code), () => {
      const code = genPrefixedBlock(...t.input)
      expect(code).to.equal(t.code)
    })
  }
  it('for (;;) break; (bracket: false)', () => {
    expect(genPrefixedBlock('for (;;)', 'break;', { bracket: false })).to.equal(
      'for (;;) break;',
    )
  })
  it('if (x) line1\nline2 (bracket: false, multi-line)', () => {
    expect(
      genPrefixedBlock('if (x)', 'line1\nline2', { bracket: false }),
    ).to.equal('if (x) line1\nline2')
  })
})

const genIfTests: Array<{
  input: Parameters<typeof genIf>
  code: string
}> = [
  {
    input: ['x > 0', 'return x;'],
    code: `if (x > 0) {
  return x;
}`,
  },
  {
    input: ['ok', ['doA();', 'doB();']],
    code: `if (ok) {
  doA();
  doB();
}`,
  },
  {
    input: ['x', 'console.log(x);', { bracket: false }],
    code: 'if (x) console.log(x);',
  },
  {
    input: ['cond', [], {}],
    code: 'if (cond) {}',
  },
]

describe('genIf', () => {
  for (const t of genIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genIf(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genElseIfTests: Array<{
  input: Parameters<typeof genElseIf>
  code: string
}> = [
  {
    input: ['x < 0', 'return -x;'],
    code: `else if (x < 0) {
  return -x;
}`,
  },
  {
    input: ['ok', 'doIt();', { bracket: false }],
    code: 'else if (ok) doIt();',
  },
]

describe('genElseIf', () => {
  for (const t of genElseIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genElseIf(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genElseTests: Array<{
  input: [string | string[], GenElseOptions?] | [string | string[]]
  code: string
}> = [
  {
    input: [['return 0;']],
    code: `else {
  return 0;
}`,
  },
  {
    input: ['fallback();'],
    code: `else {
  fallback();
}`,
  },
  {
    input: [[], {}],
    code: 'else {}',
  },
  {
    input: ['doIt();', { bracket: false }],
    code: 'else doIt();',
  },
]

describe('genElse', () => {
  for (const t of genElseTests) {
    it(genTestTitle(t.code), () => {
      const code
        = t.input.length === 1
          ? genElse(t.input[0])
          : genElse(t.input[0], t.input[1])
      expect(code).to.equal(t.code)
    })
  }
})

const genTernaryTests: Array<{
  input: Parameters<typeof genTernary>
  code: string
}> = [
  { input: ['x > 0', 'x', '-x'], code: 'x > 0 ? x : -x' },
  { input: ['ok', '\'yes\'', '\'no\''], code: 'ok ? \'yes\' : \'no\'' },
  { input: ['hasValue', 'value', 'null'], code: 'hasValue ? value : null' },
]

describe('genTernary', () => {
  for (const t of genTernaryTests) {
    it(genTestTitle(t.code), () => {
      const code = genTernary(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
