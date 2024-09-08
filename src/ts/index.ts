// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $SafeAny = any

export type GenericObject = Record<string, $SafeAny>

export type SortDirection = 'asc' | 'desc'

export type PostParams<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P]
}

export type GetParams<T> = {
  [P in keyof T]: T[P] extends boolean
    ? 'true' | 'false' // Para booleanos, permitimos solo "true" o "false"
    : T[P] extends string
      ? T[P] // Para strings, mantenemos el mismo tipo si es unión de strings
      : string // Para todos los demás tipos, usamos string
}

export type CRUDArray<T> = {
  create: Array<T>
  update: Array<T>
  delete: Array<string>
}
