export interface IdParams {
  id: string
}

export interface SearchParams {
  id?: string
  search?: string
}

export interface Paginable {
  take?: number
  skip?: number
  sortBy?: string
  sortDirection?: SortDirection
}

export type SortDirection = 'asc' | 'desc'

export interface BatchPayload {
  count: number
}

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
  create: Array<CreateParams<T>>
  update: Array<UpdateParams<T>>
  delete: Array<string>
}

export type UpdateParams<T> = {
  [P in keyof T]?: T[P] extends Date
    ? Date
    : T[P] extends Array<infer U>
      ? CRUDArray<U> // Hace `DeepPartial` para cada elemento en un array
      : T[P] extends ReadonlyArray<infer U>
        ? CRUDArray<U> // Lo mismo para arrays readonly
        : T[P] extends object
          ? UpdateParams<T[P]> // Aplica `DeepPartial` de forma recursiva para propiedades de tipo objeto
          : T[P]
}

export type CreateParams<T> = Omit<
  {
    [P in keyof T]: T[P] extends Date
      ? Date
      : T[P] extends Array<infer U>
        ? CRUDArray<U> // Hace `DeepPartial` para cada elemento en un array
        : T[P] extends ReadonlyArray<infer U>
          ? CRUDArray<U> // Lo mismo para arrays readonly
          : T[P] extends object
            ? CreateParams<T[P]> // Aplica `DeepPartial` de forma recursiva para propiedades de tipo objeto
            : T[P]
  },
  'id'
>

// interface User {
//   id: number
//   name: string
//   contact: {
//     email: string
//     phone: string
//   }
//   roles: string[]
// }

// const updateUser: CreateParams<User> = {
//   name: 'New Name',
//   roles: {
//     create: ['admin'],
//     update: ['user'],
//     delete: ['guest'],
//   },
//   contact: {
//     phone: '123456789',
//     email: 'new.email@example.com',
//   },
// }
