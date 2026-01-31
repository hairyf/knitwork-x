export interface Preset {
  label: string
  module: string
  code: string
  output: () => string[]
}
