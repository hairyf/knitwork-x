import * as knitwork from "knitwork-x";
import type { Preset } from "./types";

export const classPresets: Preset[] = [
  {
    module: "class",
    label: "genClass",
    code: `genClass('Foo', [genConstructor([], [])])
genClass('Bar', [
  genConstructor(
    [{ name: 'x', type: 'number' }],
    ['super();', 'this.x = x;']
  )
], { extends: 'Base' })`,
    output: () => [
      knitwork.genClass("Foo", [knitwork.genConstructor([], [])]),
      knitwork.genClass(
        "Bar",
        [
          knitwork.genConstructor(
            [{ name: "x", type: "number" }],
            ["super();", "this.x = x;"],
          ),
        ],
        { extends: "Base" },
      ),
    ],
  },
  {
    module: "class",
    label: "genConstructor",
    code: `genConstructor()
genConstructor(
  [{ name: 'x', type: 'string' }],
  ['super();', 'this.x = x;']
)`,
    output: () => [
      knitwork.genConstructor(),
      knitwork.genConstructor(
        [{ name: "x", type: "string" }],
        ["super();", "this.x = x;"],
      ),
    ],
  },
  {
    module: "type-alias",
    label: "genProperty",
    code: `genProperty({ name: 'x', type: 'number' })
genProperty({
  name: 'name',
  type: 'string',
  optional: true
})`,
    output: () => [
      knitwork.genProperty({ name: "x", type: "number" }),
      knitwork.genProperty({ name: "name", type: "string", optional: true }),
    ],
  },
];
