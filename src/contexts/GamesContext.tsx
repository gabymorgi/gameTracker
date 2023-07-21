import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createItem,
  filter,
  sort,
  updateAggregatedData,
  updateItem,
} from '@/back/bdUtils'
import useGameFilters from '@/hooks/useGameFilters'
import { App, message } from 'antd'
import { DocumentGameI, GameI } from '@/ts/index'

export interface FiltersI {
  name?: string
  start?: number
  end?: number
  state?: string[]
  tags?: string[]
}

export interface SorterI {
  sortBy:
    | 'name'
    | 'start'
    | 'end'
    | 'state'
    | 'hours'
    | 'achievements'
    | 'score'
  sortDirection: 'asc' | 'desc'
}

export interface variablesI {
  filters?: FiltersI
  skip?: number
  first?: number
  sorter?: SorterI
}

export const stateOrder: {
  [key: string]: number
} = {
  Banned: 0,
  Dropped: 1,
  Playing: 2,
  Won: 3,
  Completed: 4,
  Achievements: 5,
}

interface IGameContext {
  fullData?: GameI[]
  filteredData?: GameI[]
  loading: boolean
  refetch: () => Promise<void>
  createGame: (game: DocumentGameI) => Promise<string>
  updateGame: (gameId: string, game: DocumentGameI) => Promise<void>
  deleteGame: (gameId: string) => Promise<void>
}

export const GameContext = React.createContext<IGameContext>(
  {} as IGameContext
)

export const GameProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { notification } = App.useApp();
  const { query } = useGameFilters()
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState<GameI[]>()

  const getGames = useCallback(async () => {
    setLoading(true)
    // const data = await getDocs(collection(db, CollectionType.Games))
    // setParsedData(
    //   data.docs.map((doc) => {
    //     const data = doc.data() as DocumentGameI
    //     return { ...data, id: doc.id }
    //   })
    // )
    setParsedData([])
    setLoading(false)
  }, [])

  useEffect(() => {
    getGames()
  }, [getGames])

  const createGame = async (game: DocumentGameI) => {
    // const doc = await createItem(CollectionType.Games, game)
    // await updateAggregatedData(game.start, {
    //   ...game,
    //   id: doc.id,
    // })
    // setParsedData([...(parsedData || []), { ...game, id: doc.id }])
    // return doc.id
    return ""
  }

  const updateGame = async (gameId: string, game: DocumentGameI) => {
    // await updateItem(CollectionType.Games, gameId, game)
    const index = parsedData?.findIndex((g) => g.id === gameId)
    await updateAggregatedData(
      game.end,
      { ...game, id: gameId },
      index ? parsedData?.[index] : undefined
    )
    const newParsedData = [...(parsedData || [])]
    if (index !== undefined) {
      newParsedData[index] = { ...game, id: gameId }
    } else {
      newParsedData.push({ ...game, id: gameId })
    }
    setParsedData(newParsedData)
  }

  const deleteGame = async (gameId: string) => {
    notification.error({
      message: 'Deprecated',
      description: 'This function is deprecated to avoid data loss.',
    })
    // const gameDoc = doc(db, CollectionType.Games, gameId)
    // await deleteDoc(gameDoc)
    // setParsedData([...(parsedData || []).filter((g) => g.id !== gameId)])
  }

  const filteredData = useMemo(() => {
    if (!parsedData) return undefined
    let data = parsedData
    if (query) {
      data = filter(data, query as FiltersI)
      data = sort(data, query as SorterI)
    }

    return data
  }, [parsedData, query])

  return (
    <GameContext.Provider
      value={{
        fullData: parsedData,
        filteredData,
        loading,
        createGame,
        updateGame,
        deleteGame,
        refetch: getGames,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
