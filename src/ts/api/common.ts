export interface IdParams {
  id: string
}

export interface SearchParams {
  id?: string
  search?: string
}

type SortDirection = 'asc' | 'desc'

export interface Paginable {
  take?: number
  skip?: number
  sortBy?: string
  sortDirection?: SortDirection
}

export interface BatchPayload {
  count: number
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
