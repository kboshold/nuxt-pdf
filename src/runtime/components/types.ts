export type DebugMode = 'letterA' | 'letterB' | 'ruler' | 'margin'
export type MarkerMode = 'letterA' | 'letterB'

export type ASize
  = | 'A0'
    | 'A1'
    | 'A2'
    | 'A3'
    | 'A4'
    | 'A5'
    | 'A6'
    | 'A7'
    | 'A8'
    | 'A9'
    | 'A10'

export type AnySize
  = | `${ASize}`
    | `${ASize} landscape`
    | `${number}mm ${number}mm`

export interface PDFWrapperProps {
  debug?: DebugMode | DebugMode[] | false
  foldMark?: MarkerMode | false
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  size?: AnySize
}
