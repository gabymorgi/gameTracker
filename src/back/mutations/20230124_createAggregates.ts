import { startOfMonth } from 'date-fns'
import { formattedDate } from '../../utils/format'
import { DocumentAggregateI, DocumentChangelogI, DocumentGameI, GameI } from '@/ts/index'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'

const createAgregate = (date: number): DocumentAggregateI => ({
  month: date,
  hours: 0,
  achievements: 0,
  tags: {},
  states: {},
})

export const mutationCreateAggregates = async (
  themedNotification: NotificationInstance
) => {
  const notificationLogger = new NotificationLogger(
    themedNotification,
    'aggregate-creation',
    'Creating aggregates',
    'info',
    3
  )

  let games: GameI[] = []
  try {
    // const gamesDoc = await getDocs(collection(db, CollectionType.Games))
    // games = gamesDoc.docs.map((doc) => {
    //   const game = doc.data() as GameI
    //   return {
    //     ...(game as DocumentGameI),
    //     id: doc.id,
    //   }
    // })
    notificationLogger.success('Games loaded')
  } catch (e: any) {
    notificationLogger.error(e.message)
    return
  }
  // const changelogs = await getDocs(collection(db, CollectionType.Changelogs))
  const aggregates: { [key: string]: DocumentAggregateI } = {}
  // changelogs.forEach(async (changelog) => {
  //   const changelogData = changelog.data() as DocumentChangelogI

  //   const game = games.find((g) => g.id === changelogData.gameId)
  //   if (!game) {
  //     notificationLogger.addMsg({
  //       type: 'error',
  //       title: `Game not found ${changelogData.gameId}`,
  //     })
  //     return
  //   }

  //   const key = formattedDate(startOfMonth(changelogData.createdAt))
  //   if (!aggregates[key]) {
  //     aggregates[key] = createAgregate(changelogData.createdAt)
  //   }

  //   aggregates[key].hours += changelogData.hours
  //   game.tags.forEach((tag) => {
  //     aggregates[key].tags[tag] = (aggregates[key].tags[tag] || 0) + changelogData.hours
  //   })
  //   if (changelogData.state !== 'Playing') {
  //     aggregates[key].states[changelogData.state] =
  //       (aggregates[key].states[changelogData.state] || 0) + 1
  //   }

  //   aggregates[key].achievements += changelogData.achievements
  // })

  notificationLogger.success('Aggregates formatted')

  // const batch = writeBatch(db)
  // Object.entries(aggregates).forEach(([key, aggregate]) => {
  //   batch.set(doc(db, CollectionType.Aggregates, key), aggregate)
  // })
  // await batch.commit()
  notificationLogger.success('Aggregates created')
}
