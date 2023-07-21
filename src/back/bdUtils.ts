import { FiltersI, SorterI, stateOrder } from '@/contexts/GamesContext'
import { DocumentChangelogI, GameI } from '@/ts/index'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'

export function filter(data: GameI[], filters: FiltersI): GameI[] {
  const { name, start, end, state, tags } = filters
  return data.filter((game) => {
    if (name && !game.name?.toLowerCase().includes(name.toLowerCase())) return false
    if (start && end) {
      // if game range is outside filter range, return false
      if (game.start > end || game.end < start) return false
    } else if (start) {
      //if game ends before filter start, return false
      if (game.end < start) return false
    } else if (end) {
      //if game starts after filter end, return false
      if (game.start > end) return false
    }
    if (state?.length && !state.includes(game.state)) {
      return false
    }
    if (tags?.length && !tags.some((tag) => game.tags.includes(tag))) {
      return false
    }
    return true
  })
}

export function sort(data: GameI[], sorter: SorterI): GameI[] {
  const { sortBy, sortDirection } = sorter
  return data.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        if (sortDirection === 'asc') return a.name?.localeCompare(b.name || '') || 0
        return b.name?.localeCompare(a.name || '') || 0
      case 'start':
        if (sortDirection === 'asc') return a.start - b.start
        return b.start - a.start
      case 'end':
        if (sortDirection === 'asc') return (a.end || a.start) - (b.end || b.start)
        return (b.end || b.start) - (a.end || a.start)
      case 'state':
        if (sortDirection === 'asc') return stateOrder[a.state] - stateOrder[b.state]
        return stateOrder[b.state] - stateOrder[a.state]
      case 'hours':
        if (sortDirection === 'asc') return (a.hours || 0) - (b.hours || 0)
        return (b.hours || 0) - (a.hours || 0)
      case 'score':
        if (sortDirection === 'asc')
          return (a.score?.finalMark || 0) - (b.score?.finalMark || 0)
        return (b.score?.finalMark || 0) - (a.score?.finalMark || 0)
      case 'achievements':
        return 0
      // if (sortDirection === "asc")
      //   return (a.achievements ? a.achievements[0] / a.achievements[1] : 0) - (b.achievements ? b.achievements[0] / b.achievements[1] : 0);
      // return (b.achievements ? b.achievements[0] / b.achievements[1] : 0) - (a.achievements ? a.achievements[0] / a.achievements[1] : 0);
    }
    return 0
  })
}

export function autoId(bannedIds: string[]): string {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  do {
    for (let i = 0; i < 20; i++) {
      autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
    }
  } while (bannedIds.includes(autoId))
  return autoId
}

export function removeUndefinedFields(obj: any): any {
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      obj[index] = removeUndefinedFields(item)
    })
    return obj
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      obj[key] = removeUndefinedFields(obj[key])
    }
  })
  return obj
}

// const createAgregate = (date: number): DocumentAggregateI => ({
//   month: date,
//   hours: 0,
//   achievements: 0,
//   tags: {},
//   states: {},
// })

// const getAgregateId = (date: number): string => {
//   return formattedDate(startOfMonth(date))
// }

export const createItem = () => {}
// async (collectionType: CollectionType, item: any) => {
//   const newDoc = await addDoc(collection(db, collectionType), removeUndefinedFields(item))
//   return newDoc
// }

export const updateItem = () => {}
// async (
//   collectionType: CollectionType,
//   id: string,
//   item: any
// ) => {
//   const itemDoc = doc(db, collectionType, id)
//   await updateDoc(itemDoc, removeUndefinedFields(item))
//   return itemDoc
// }

export const deleteItem = () => {}
// async (collectionType: CollectionType, itemId: string) => {
//   const itemDoc = doc(db, collectionType, itemId)
//   await deleteDoc(itemDoc)
//   return itemDoc
// }

export const updateAggregatedData = async (
  month: number,
  newGame: GameI,
  prevGame?: GameI
) => {
  try {
    const changelog: DocumentChangelogI = {
      createdAt: month,
      gameName: newGame.name,
      gameId: newGame.id,
      hours: (newGame.hours || 0) - (prevGame?.hours || 0),
      achievements: newGame.achievements[0] - (prevGame?.achievements[0] || 0),
      state: 'Playing',
    }
    if (newGame.state !== 'Playing' && newGame.state !== prevGame?.state) {
      changelog.state = newGame.state
    }
    // await addDoc(collection(db, CollectionType.Changelogs), changelog)
    // const agregateId = getAgregateId(month)
    // const agregate = await getDoc(doc(db, CollectionType.Aggregates, agregateId))
    const agregateData = {} as any
    // agregate.exists()
    //   ? (agregate.data() as DocumentAggregateI)
    //   : createAgregate(dateToNumber(startOfMonth(newGame.start)))

    agregateData.hours += changelog.hours
    agregateData.achievements += changelog.achievements
    if (changelog.state !== 'Playing') {
      agregateData.states[changelog.state] =
        (agregateData.states[changelog.state] || 0) + 1
    }
    if (newGame.tags) {
      for (const tag of newGame.tags) {
        agregateData.tags[tag] = (agregateData.tags[tag] || 0) + changelog.hours
      }
    }
    // if (agregate.exists()) {
    //   await updateDoc(agregate.ref, agregateData as any)
    // } else {
    //   await setDoc(agregate.ref, agregateData)
    // }
  } catch (e: any) {
    console.log(e.message)
  }
}

export async function updateGame(
  month: number,
  game: GameI
): Promise<void> {
  //check for existing game
  let existingGame: GameI | undefined
  if (game.id) {
    // const docGame = await getDoc(doc(db, CollectionType.Games, game.id))
    // if (docGame.exists()) {
    //   existingGame = {
    //     ...(docGame.data() as GameI),
    //     id: docGame.id,
    //   }
    // }
  } else {
    // check existing games by appId or name
    // const games = await getDocs(
    //   query(
    //     collection(db, CollectionType.Games),
    //     where('appId', '==', game.appid),
    //     where('name', '==', game.name)
    //   )
    // )
    // if (games.docs.length > 0) {
    //   existingGame = {
    //     ...(games.docs[0].data() as GameI),
    //     id: games.docs[0].id,
    //   }
    // }
  }
  if (existingGame) {
    game.id = existingGame.id
    // await updateItem(CollectionType.Games, existingGame.id, game)
  } else {
    // const item = await createItem(CollectionType.Games, game)
    // game.id = item.id
  }
  await updateAggregatedData(month, game, existingGame)
}

export async function massiveUpdate(
  month: number,
  newData: Array<GameI>,
  notification: NotificationInstance
): Promise<void> {
  const notificationLogger = new NotificationLogger(
    notification,
    'massive-update',
    'Massive update',
    'info',
    newData.length
  )
  for (const newGame of newData) {
    await updateGame(month, newGame)
    notificationLogger.success()
  }
}
