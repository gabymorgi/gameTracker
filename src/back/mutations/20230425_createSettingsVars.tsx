import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'

export const mutationCreateSettingsVars = async (
  themedNotification: NotificationInstance
) => {
  const notificationLogger = new NotificationLogger(
    themedNotification,
    'settings-creation',
    'Creating settings',
    'info',
    4
  )

  // const tagsDocs = await getDocs(collection(db, CollectionType.Tags))
  // const tags: Array<{ name: string, hue: number }> = tagsDocs.docs.map((doc) => {
  //   return {
  //     name: doc.id,
  //     hue: Math.floor(doc.data().hue),
  //   }
  // })
  // console.log(tags)
  // notificationLogger.success('Tags obtained')

  // const statesDocs = await getDocs(collection(db, CollectionType.States))
  // const states: Array<{ name: string, hue: number }> = statesDocs.docs.map((doc) => {
  //   return {
  //     name: doc.id,
  //     hue: doc.data().hue
  //   }
  // })
  // console.log(states)
  // notificationLogger.success('States obtained')

  // const gamesDocs = await getDocs(collection(db, CollectionType.Games))
  // const games = gamesDocs.docs.map((doc) => doc.data().name)
  // console.log(games)
  // notificationLogger.success('Games obtained')

  // const batch = writeBatch(db)
  // batch.set(doc(db, CollectionType.Settings, 'tags'), { values: tags })
  // batch.set(doc(db, CollectionType.Settings, 'states'), { values: states })
  // batch.set(doc(db, CollectionType.Settings, 'games'), { values: games })
  // await batch.commit()

  notificationLogger.success('Settings created')
}
