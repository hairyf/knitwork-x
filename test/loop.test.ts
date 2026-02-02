import { describe, expect, it } from 'vitest'
import { genDoWhile, genFor, genForIn, genForOf, genWhile } from '../src'
import { genTestTitle } from './_utils'

const genForTests: Array<{
  input: Parameters<typeof genFor>
  code: string
}> = [
  {
    input: ['let i = 0', 'i < n', 'i++', 'console.log(i);'],
    code: `for (let i = 0; i < n; i++) {
  console.log(i);
}`,
  },
  {
    input: ['', 'true', '', ['doWork();', 'if (done) break;']],
    code: `for (; true; ) {
  doWork();
  if (done) break;
}`,
  },
  {
    input: ['i = 0', 'i < 10', 'i++', 'sum += i;', { bracket: false }],
    code: 'for (i = 0; i < 10; i++) sum += i;',
  },
  {
    input: ['let j = 0', 'j < 5', 'j++', [], {}],
    code: 'for (let j = 0; j < 5; j++) {}',
  },
]

describe('genFor', () => {
  for (const t of genForTests) {
    it(genTestTitle(t.code), () => {
      const code = genFor(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genForOfTests: Array<{
  input: Parameters<typeof genForOf>
  code: string
}> = [
  {
    input: ['const x', 'items', 'console.log(x);'],
    code: `for (const x of items) {
  console.log(x);
}`,
  },
  {
    input: ['let [k, v]', 'Object.entries(obj)', ['process(k, v);']],
    code: `for (let [k, v] of Object.entries(obj)) {
  process(k, v);
}`,
  },
  {
    input: ['const item', 'list', 'yield item;', { bracket: false }],
    code: 'for (const item of list) yield item;',
  },
  {
    input: ['const el', 'arr', [], {}],
    code: 'for (const el of arr) {}',
  },
]

describe('genForOf', () => {
  for (const t of genForOfTests) {
    it(genTestTitle(t.code), () => {
      const code = genForOf(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genForInTests: Array<{
  input: Parameters<typeof genForIn>
  code: string
}> = [
  {
    input: ['const key', 'obj', 'console.log(key, obj[key]);'],
    code: `for (const key in obj) {
  console.log(key, obj[key]);
}`,
  },
  {
    input: ['const k', 'o', ['sum += o[k];']],
    code: `for (const k in o) {
  sum += o[k];
}`,
  },
  {
    input: ['let p', 'obj', 'visit(p);', { bracket: false }],
    code: 'for (let p in obj) visit(p);',
  },
  {
    input: ['const prop', 'target', [], {}],
    code: 'for (const prop in target) {}',
  },
]

describe('genForIn', () => {
  for (const t of genForInTests) {
    it(genTestTitle(t.code), () => {
      const code = genForIn(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genWhileTests: Array<{
  input: Parameters<typeof genWhile>
  code: string
}> = [
  {
    input: ['running', 'step();'],
    code: `while (running) {
  step();
}`,
  },
  {
    input: ['i > 0', ['process();', 'i--;']],
    code: `while (i > 0) {
  process();
  i--;
}`,
  },
  {
    input: ['ok', 'doIt();', { bracket: false }],
    code: 'while (ok) doIt();',
  },
  {
    input: ['cond', [], {}],
    code: 'while (cond) {}',
  },
]

describe('genWhile', () => {
  for (const t of genWhileTests) {
    it(genTestTitle(t.code), () => {
      const code = genWhile(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genDoWhileTests: Array<{
  input: Parameters<typeof genDoWhile>
  code: string
}> = [
  {
    input: ['step();', '!done'],
    code: `do {
  step();
} while (!done);`,
  },
  {
    input: [['read();', 'check();'], 'eof'],
    code: `do {
  read();
  check();
} while (eof);`,
  },
  {
    input: ['next();', 'hasMore', { bracket: false }],
    code: 'do next(); while (hasMore);',
  },
  {
    input: [[], 'false', {}],
    code: 'do {} while (false);',
  },
  {
    input: ['line1\nline2', 'cond', { bracket: false }],
    code: 'do line1\nline2 while (cond);',
  },
]

describe('genDoWhile', () => {
  for (const t of genDoWhileTests) {
    it(genTestTitle(t.code), () => {
      const code = genDoWhile(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
