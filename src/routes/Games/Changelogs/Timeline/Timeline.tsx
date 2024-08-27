import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { query } from '@/hooks/useFetch'
import { InView } from 'react-intersection-observer'
import useGameFilters from '@/hooks/useGameFilters'
import { ChangelogI } from '@/ts/game'
import { apiToChangelog } from '@/utils/format'
import { enUS } from 'date-fns/locale'
import { Month } from 'date-fns'
import ChangelogListItem from './ChangelogListItem'
import { NodeBranch, Tree, TreeNode } from '@/components/ui/Tree'

const mockedData = [
  {
    id: '6e3c2b9a-b2f2-415d-861a-b54e5879d26e',
    gameId: '48324b64-48fa-4f64-b3b0-ff1409b92d8d',
    stateId: 'Achievements',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 13,
    achievements: 4,
    game: {
      name: 'A Castle Full of Cats',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/2070550/header.jpg',
    },
  },
  {
    id: 'd270baf5-fa98-40e8-a701-c12ec4c4fde6',
    gameId: '346f144f-2768-42d7-b70c-19b04ec042dd',
    stateId: 'Achievements',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 553,
    achievements: 30,
    game: {
      name: 'Cat Quest III',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/2305840/header.jpg',
    },
  },
  {
    id: 'ee7747dc-71cc-43d4-b5ac-77a5121bc219',
    gameId: 'd8cc0b69-9a49-4a9b-a69a-3c91488ac5bc',
    stateId: 'Dropped',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 154,
    achievements: 12,
    game: {
      name: 'Last Command',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1487270/header.jpg',
    },
  },
  {
    id: '6dce0813-ac78-4f4d-9d7e-55f7ec477788',
    gameId: 'b2c2007c-3bab-4fa4-90ac-8b22faf4629a',
    stateId: 'Playing',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 121,
    achievements: 3,
    game: {
      name: 'Voidigo',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1304680/header.jpg',
    },
  },
  {
    id: '6b51afbd-12b3-498c-9029-02c5a8fb096d',
    gameId: '3a456752-5345-4433-aa09-465d92f963e8',
    stateId: 'Won',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 202,
    achievements: 0,
    game: {
      name: 'Cult of the Lamb',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1313140/header.jpg',
    },
  },
  {
    id: '66432140-d9f7-4bdd-82e5-412dc1b36fc8',
    gameId: 'ca75e763-d536-43be-a472-152afdf1974d',
    stateId: 'Playing',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 522,
    achievements: 2,
    game: {
      name: 'The Great Ace Attorney Chronicles',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1158850/header.jpg',
    },
  },
  {
    id: 'b7fb150c-1f71-40e6-9c64-0f3d0d6dc930',
    gameId: '3dfae6ce-4d8d-4537-885c-0c287cfe4a5a',
    stateId: 'Playing',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 460,
    achievements: 0,
    game: {
      name: 'Spelunky',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/239350/header.jpg',
    },
  },
  {
    id: '529d4536-1b30-415a-861e-3ea836e25f45',
    gameId: '055e067e-2301-41ad-a1ba-442c39e28cf9',
    stateId: 'Playing',
    createdAt: '2024-08-01T03:00:00.000Z',
    hours: 90,
    achievements: 6,
    game: {
      name: 'Gravity Circuit',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/858710/header.jpg',
    },
  },
  {
    id: 'ba262a35-f7ee-4499-b73c-71f77471f07d',
    gameId: '7656f841-2b05-4366-8be3-5108d12b6276',
    stateId: 'Playing',
    createdAt: '2024-07-24T23:11:28.134Z',
    hours: 0,
    achievements: 0,
    game: {
      name: 'Supaplex',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/833140/header.jpg',
    },
  },
  {
    id: 'b414af2e-766d-425b-a137-6e76238ffbc2',
    gameId: 'd8cc0b69-9a49-4a9b-a69a-3c91488ac5bc',
    stateId: 'Playing',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 92,
    achievements: 8,
    game: {
      name: 'Last Command',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1487270/header.jpg',
    },
  },
  {
    id: 'f0ab2e39-de39-4edb-aaaf-e5f8468ea63a',
    gameId: '3dfae6ce-4d8d-4537-885c-0c287cfe4a5a',
    stateId: 'Playing',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 223,
    achievements: 0,
    game: {
      name: 'Spelunky',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/239350/header.jpg',
    },
  },
  {
    id: 'f7b464e9-f125-471c-9250-1cf458e7cc35',
    gameId: 'b2c2007c-3bab-4fa4-90ac-8b22faf4629a',
    stateId: 'Playing',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 819,
    achievements: 73,
    game: {
      name: 'Voidigo',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1304680/header.jpg',
    },
  },
  {
    id: 'dd1770da-23b1-4f1d-bb39-eb79fa5a39e3',
    gameId: '055e067e-2301-41ad-a1ba-442c39e28cf9',
    stateId: 'Playing',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 59,
    achievements: 3,
    game: {
      name: 'Gravity Circuit',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/858710/header.jpg',
    },
  },
  {
    id: '684d7428-ded4-4f8f-adfe-9e1e6717666c',
    gameId: '77e2836f-010b-4636-ad3f-e50e48b678a8',
    stateId: 'Dropped',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 167,
    achievements: 0,
    game: {
      name: 'Risk of Rain Returns',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1337520/header.jpg',
    },
  },
  {
    id: 'fc2f3f57-5876-4d9f-bac5-827dd5766632',
    gameId: 'd52773a6-92c2-4fa8-a54d-86f47abb108b',
    stateId: 'Won',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 146,
    achievements: 2,
    game: {
      name: 'Toodee and Topdee',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1303950/header.jpg',
    },
  },
  {
    id: 'ca5829f3-716d-4b1a-8a9d-2895676033dd',
    gameId: 'ca75e763-d536-43be-a472-152afdf1974d',
    stateId: 'Playing',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 1601,
    achievements: 4,
    game: {
      name: 'The Great Ace Attorney Chronicles',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1158850/header.jpg',
    },
  },
  {
    id: 'fda8b288-e36e-4d55-8ad2-16e4523736ce',
    gameId: 'e2beb7a5-37bf-49a7-afec-c471d7a13507',
    stateId: 'Won',
    createdAt: '2024-07-01T03:00:00.000Z',
    hours: 393,
    achievements: 0,
    game: {
      name: 'Shovel Knight: Treasure Trove',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/250760/header.jpg',
    },
  },
  {
    id: '21c3de10-5e65-4d2b-bca6-c59195c8d2b6',
    gameId: '1eb8fc93-8d34-4260-8a0b-28b13d9219f3',
    stateId: 'Banned',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 66,
    achievements: 0,
    game: {
      name: 'Pit People',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/291860/header.jpg',
    },
  },
  {
    id: '0af9be7c-4a98-4ba8-85f5-450a6d14ae8c',
    gameId: 'ca75e763-d536-43be-a472-152afdf1974d',
    stateId: 'Playing',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 663,
    achievements: 2,
    game: {
      name: 'The Great Ace Attorney Chronicles',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1158850/header.jpg',
    },
  },
  {
    id: 'fba7f75e-9ad8-4bd3-88d7-4526e6cd77fa',
    gameId: '216abf7f-1065-4877-a6bb-c0afa31c4460',
    stateId: 'Completed',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 309,
    achievements: 11,
    game: {
      name: 'Braid, Anniversary Edition',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/499180/header.jpg',
    },
  },
  {
    id: 'c30043d8-30c8-4d12-a4c4-835cb3743d5b',
    gameId: 'e89c83f8-6c95-443c-a2c9-6f7023f5069a',
    stateId: 'Achievements',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 144,
    achievements: 6,
    game: {
      name: 'Duck Detective: The Secret Salami',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/2637990/header.jpg',
    },
  },
  {
    id: '7d134b7b-810d-4053-b794-372f85fb884b',
    gameId: '25917f1e-b429-4951-b67f-37c69bcc906f',
    stateId: 'Dropped',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 153,
    achievements: 10,
    game: {
      name: 'Turnip Boy Robs a Bank',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/2097230/header.jpg',
    },
  },
  {
    id: '6ac59b38-aeeb-4d36-82f2-daadc9e56c0d',
    gameId: '7f2cb678-a6b7-47b3-a9f8-fcd9c7e1c0de',
    stateId: 'Completed',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 641,
    achievements: 33,
    game: {
      name: "Minishoot' Adventures",
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1634860/header.jpg',
    },
  },
  {
    id: 'ed3ef325-47a8-4134-a7c5-e4ca9ecdcb9f',
    gameId: '6f1e0670-d975-4159-8cfa-022b220d8d19',
    stateId: 'Completed',
    createdAt: '2024-06-01T03:00:00.000Z',
    hours: 141,
    achievements: 6,
    game: {
      name: 'Pepper Grinder',
      imageUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/2076580/header.jpg',
    },
  },
]

type TreeChangeLog = Record<string, Record<string, Record<string, ChangelogI>>>

const Timeline = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const [data, setData] = useState<TreeChangeLog>()
  const [isMore, setIsMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData(undefined)
      }
      const newData = mockedData
        // await query('changelogs/get', {
        //   pageNumber: page.current,
        //   pageSize: 24,
        //   ...Object.fromEntries(
        //     Object.entries(queryParams).filter(
        //       ([, v]) => v != null && v !== '',
        //     ),
        //   ),
        // })
        .map(apiToChangelog)
      setIsMore(newData.length === 24)
      // debugger
      const newDataTree: TreeChangeLog = {
        ...data,
      }
      for (const changelog of newData) {
        const year = 'a' + changelog.createdAt.getFullYear()
        const month = 'a' + changelog.createdAt.getMonth()
        if (newDataTree && newDataTree[year]) {
          if (newDataTree[year][month]) {
            newDataTree[year][month][changelog.id] = changelog
          } else {
            newDataTree[year][month] = {
              [changelog.id]: changelog,
            }
          }
        } else {
          newDataTree[year] = {
            [month]: {
              [changelog.id]: changelog,
            },
          }
        }
      }
      setData(newDataTree)
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const addChangelog = async (values: ChangelogI) => {
    setLoading(true)
    await query('changelogs/create', values)
    setData((prev) => {
      const year = 'a' + values.createdAt.getFullYear()
      const month = 'a' + values.createdAt.getMonth()
      if (prev && prev[year]) {
        if (prev[year][month]) {
          prev[year][month][values.id] = values
        } else {
          prev[year][month] = {
            [values.id]: values,
          }
        }
      } else {
        prev![year] = {
          [month]: {
            [values.id]: values,
          },
        }
      }
      return prev
    })
    setLoading(false)
  }

  const editChangelog = async (values: ChangelogI, id: string) => {
    setLoading(true)
    // console.log(values, id)
    await query('changelogs/update', values)
    setData((prev) => {
      const year = 'a' + values.createdAt.getFullYear()
      const month = 'a' + values.createdAt.getMonth()
      if (prev && prev[year] && prev[year][month]) {
        prev[year][month][id] = values
      }
      return prev
    })
    setLoading(false)
  }

  const handleFinish = async (values: ChangelogI, id?: string) => {
    if (!id) {
      addChangelog(values)
    } else {
      editChangelog(values, id)
    }
  }

  const deleteChangelog = async (
    year: string,
    month: string,
    changelogId: string,
  ) => {
    setLoading(true)
    await query('changelogs/delete', { id: changelogId })
    setData((prev) => {
      delete prev![year][month][changelogId]
      return prev
    })
    setLoading(false)
  }

  const treeData: TreeNode[] = useMemo(() => {
    const treeData: TreeNode[] = Object.entries(data || []).map(
      ([year, months]) => ({
        title: year.slice(1),
        key: year,
        children: Object.entries(months).map(([month, changelogs]) => ({
          title: enUS.localize.month(Number(month.slice(1)) as Month),
          key: month,
          children: Object.entries(changelogs).map(([id, changelog]) => ({
            element: (
              <ChangelogListItem
                changelog={changelog}
                onFinish={handleFinish}
                onDelete={() => deleteChangelog(year, month, id)}
              />
            ),
            key: id,
          })),
        })),
      }),
    )
    if (!treeData.length) {
      treeData.push({
        title: 'loading year',
        key: 'loading-5',
        children: [
          {
            title: 'loading month',
            key: 'loading-4',
            children: [
              {
                element: 'loading',
                key: 'loading-1',
              },
              {
                element: 'loading',
                key: 'loading-2',
              },
              {
                element: 'loading',
                key: 'loading-3',
              },
            ],
          },
        ],
      })
    } else {
      const child: NodeBranch = treeData.at(-1) as NodeBranch
      const grandChild: NodeBranch = child.children.at(-1) as NodeBranch
      grandChild?.children.push(
        {
          element: (
            <InView as="div" onChange={(inView) => console.log(inView)}>
              Load more
            </InView>
          ),
          key: 'loading-1',
        },
        {
          element: 'loading',
          key: 'loading-2',
        },
        {
          element: 'loading',
          key: 'loading-3',
        },
      )

      child.children!.push({
        key: 'loading-4',
        title: 'loading month',
        children: [
          {
            element: 'loading',
            key: 'loading-1',
          },
          {
            element: 'loading',
            key: 'loading-2',
          },
          {
            element: 'loading',
            key: 'loading-3',
          },
        ],
      })

      treeData.push({
        key: 'loading-4',
        title: 'loading year',
        children: [
          {
            element: 'loading',
            key: 'loading-1',
          },
          {
            element: 'loading',
            key: 'loading-2',
          },
          {
            element: 'loading',
            key: 'loading-3',
          },
        ],
      })
    }

    return treeData
  }, [data])

  return (
    <Flex vertical gap="middle">
      <Spin spinning={loading} fullscreen />
      <Tree treeData={treeData} />
    </Flex>
  )
}

export default Timeline
