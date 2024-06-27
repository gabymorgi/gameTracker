import { GenericTag } from '@/contexts/GlobalContext'
import { message } from '@/contexts/GlobalContext'
import { ApiGetGameTags } from '@/ts/api'

interface GameI {
  id: string
  tags: string[]
}

type Dictionary<T> = Record<string, T>

function parseGameTags(gameTags: ApiGetGameTags[]): GameI[] {
  const gamesObject: { [id: string]: string[] } = {}
  gameTags.forEach((game) => {
    if (!game.gameId || !game.tagId) {
      message.error(`No gameId ${game}`)
      return
    }
    if (gamesObject[game.gameId]) {
      gamesObject[game.gameId].push(game.tagId)
    } else {
      gamesObject[game.gameId] = [game.tagId]
    }
  })

  // to array

  const gamesArray: GameI[] = Object.entries(gamesObject).map(([id, tags]) => {
    return { id, tags }
  })

  return gamesArray
}

function getAppearances(games: ApiGetGameTags[]): Dictionary<number> {
  const appearances: Dictionary<number> = {}
  games.forEach((game) => {
    if (appearances[game.tagId]) {
      appearances[game.tagId] += 1
    } else {
      appearances[game.tagId] = 1
    }
  })

  return appearances
}

function getConnections(games: GameI[]): Dictionary<Dictionary<number>> {
  // Crear el grafo
  const connections: Dictionary<Dictionary<number>> = {}

  for (const game of games) {
    const tags = game.tags

    // Añadir aristas entre todos los pares de tags para este juego
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        if (!connections[tags[i]]) {
          connections[tags[i]] = { [tags[j]]: 1 }
        } else {
          if (!connections[tags[i]][tags[j]]) {
            connections[tags[i]][tags[j]] = 1
          } else {
            connections[tags[i]][tags[j]] += 1
          }
        }
        if (!connections[tags[j]]) {
          connections[tags[j]] = { [tags[i]]: 1 }
        } else {
          if (!connections[tags[j]][tags[i]]) {
            connections[tags[j]][tags[i]] = 1
          } else {
            connections[tags[j]][tags[i]] += 1
          }
        }
      }
    }
  }

  return connections
}

function getSimilarityDic(
  games: GameI[],
  similarity?: boolean,
): Dictionary<Dictionary<number>> {
  // Crear el grafo
  const graph: Dictionary<Dictionary<number>> = {}
  const uniqueTags: string[] = []

  // extraer todos los tags únicos
  for (const game of games) {
    const tags = game.tags
    for (const tag of tags) {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag)
      }
    }
  }

  // Añadir todos los tags al grafo
  for (const tag of uniqueTags) {
    graph[tag] = {}

    for (const otherTag of uniqueTags) {
      graph[tag][otherTag] = 0
    }
  }

  for (const game of games) {
    const tags = game.tags

    // Añadir aristas entre todos los pares de tags para este juego
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        if (tags[i] == tags[j]) {
          message.error(`Same tag ${game.id} ${tags[i]}`)
          continue
        }
        graph[tags[i]][tags[j]] += 1
        graph[tags[j]][tags[i]] += 1
      }
    }
  }

  // Normalizar el grafo
  for (const node in graph) {
    const edges = graph[node]
    const total = Object.values(edges).reduce((a, b) => a + b, 0)
    if (total == 0) {
      continue
    }
    for (const edge in edges) {
      graph[node][edge] /= total
    }
  }
  if (!similarity) {
    for (const node in graph) {
      const edges = graph[node]
      for (const edge in edges) {
        graph[node][edge] = Math.pow(1 - graph[node][edge], 2)
      }
    }
  }

  return graph
}

export class CirclePackaging {
  public threshold: number
  public name: string
  public children: CirclePackaging[]
  public color: number
  public appearances: number

  constructor(threshold: number, children: CirclePackaging[], name?: string) {
    this.threshold = threshold
    this.name = name || `group-${threshold.toFixed(2)}`
    this.appearances = 0
    this.color = 0
    this.children = children
  }

  static fromSimilarityDic(
    similarityDic: Dictionary<Dictionary<number>>,
    thresholdStep: number = 0.1,
    parentNode?: CirclePackaging,
  ): CirclePackaging {
    const parentCluster =
      parentNode ||
      new CirclePackaging(
        0,
        Object.keys(similarityDic).map(
          (member) => new CirclePackaging(0, [], member),
        ),
        'root',
      )
    if (Object.keys(similarityDic).length <= 1) return parentCluster

    let currentThreshold = parentCluster.threshold + thresholdStep
    let clusters = this.hierarchicalClustering(similarityDic, currentThreshold)
    // Si solo hay un cluster, aumentar el threshold y volver a intentar
    while (clusters.length == 1) {
      parentCluster.threshold = currentThreshold
      currentThreshold += thresholdStep
      clusters = this.hierarchicalClustering(similarityDic, currentThreshold)
    }

    // if (clusters.length >= Object.keys(similarityDic).length)
    //   return parentCluster;

    parentCluster.children = clusters.map((cluster) => {
      const childNode = new CirclePackaging(
        currentThreshold,
        [],
        cluster.length == 1 ? cluster[0] : undefined,
      )
      if (cluster.length > 1) {
        const subSimilarityDic = this.createSubSimilarityDic(
          similarityDic,
          cluster,
        )
        this.fromSimilarityDic(subSimilarityDic, thresholdStep, childNode)
      }
      return childNode
    })

    if (!parentNode) parentCluster.assignColors()

    return parentCluster
  }

  static hierarchicalClustering(
    similarityDic: Dictionary<Dictionary<number>>,
    threshold: number,
  ): string[][] {
    const keys = Object.keys(similarityDic)
    const clusters: string[][] = keys.map((key) => [key])

    while (clusters.length > 1) {
      let maxSim = 0,
        maxI = 0,
        maxJ = 0
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const sim = this.averageLinkage(
            similarityDic,
            clusters[i],
            clusters[j],
          )
          if (sim > maxSim) {
            maxSim = sim
            maxI = i
            maxJ = j
          }
        }
      }

      if (maxSim < threshold) break

      const newCluster = clusters[maxI].concat(clusters[maxJ])
      clusters.splice(maxJ, 1)
      clusters.splice(maxI, 1)
      clusters.push(newCluster)
    }

    return clusters
  }

  static averageLinkage(
    similarityMatrix: Dictionary<Dictionary<number>>,
    cluster1: string[],
    cluster2: string[],
  ) {
    let sim = 0
    for (const p1 of cluster1) {
      for (const p2 of cluster2) {
        sim += (similarityMatrix[p1][p2] + similarityMatrix[p2][p1]) / 2
      }
    }
    sim /= cluster1.length * cluster2.length
    return sim
  }

  assignColors(start: number = 0, end: number = 300) {
    this.color = Math.round((start + end) / 2)

    if (this.children.length == 0) {
      return
    }

    let total = 0
    const thresholdDiffs = []

    // Calcular la diferencia de threshold y su inverso para cada cluster
    for (const cluster of this.children) {
      const diff = 1 / (cluster.threshold - this.threshold)
      thresholdDiffs.push(diff)
      total += diff
    }

    // Asignar rangos de colores en función de las diferencias de threshold
    let current = start
    for (let i = 0; i < this.children.length; i++) {
      const proportion = thresholdDiffs[i] / total
      const colorRange = (end - start) * proportion

      // Asignar colores a subclusters
      this.children[i].assignColors(current, current + colorRange)

      current += colorRange
    }
  }

  updateColorsFromLeafNodes() {
    if (this.children.length == 0) {
      return
    }

    let colorSum = 0
    // Calcular la diferencia de threshold y su inverso para cada cluster
    for (const cluster of this.children) {
      cluster.updateColorsFromLeafNodes()
      colorSum += cluster.color
    }

    this.color = Math.round(colorSum / this.children.length)
  }

  setAppearances(appearances: Dictionary<number>) {
    if (this.children.length == 0) {
      this.appearances = appearances[this.name] || 0
      return
    }

    for (const child of this.children) {
      child.setAppearances(appearances)
      this.appearances += child.appearances
    }
  }

  getLeafNodes(): CirclePackaging[] {
    if (this.children.length == 0) return [this]

    let leafNodes: CirclePackaging[] = []
    for (const child of this.children) {
      leafNodes = leafNodes.concat(child.getLeafNodes())
    }

    return leafNodes
  }

  private static createSubSimilarityDic(
    similarityDic: Dictionary<Dictionary<number>>,
    members: string[],
  ): Dictionary<Dictionary<number>> {
    const result: Dictionary<Dictionary<number>> = {}
    for (const member of members) {
      result[member] = {}
      for (const otherMember of members) {
        result[member][otherMember] = similarityDic[member][otherMember]
      }
    }
    return result
  }
}

interface Connection {
  name: string
  amount: number
}

export class EdgeBundling {
  public name: string
  public color: number
  public difference: number
  public children: EdgeBundling[]
  public connections: Connection[]

  constructor(
    name: string,
    children: EdgeBundling[],
    connections: Connection[],
    oldColor: number = 0,
    newColor: number = 0,
  ) {
    this.name = name
    this.color = newColor
    this.difference = this.getShortestAngleDifference(newColor, oldColor)
    this.children = children
    this.connections = connections
  }

  getShortestAngleDifference(newColor: number, oldColor: number): number {
    let difference = (newColor - oldColor) % 360
    if (difference > 180) difference -= 360
    if (difference < -180) difference += 360
    return difference
  }
}

export function getClusteringData(
  gameTags: ApiGetGameTags[],
  tags: GenericTag,
): { circlePackaging: CirclePackaging; edgeBundling: EdgeBundling } {
  const parsedGames = parseGameTags(gameTags)

  // calculate colors for each tag
  const differenceDic = getSimilarityDic(parsedGames, false)
  const differenceCirclePackaging = CirclePackaging.fromSimilarityDic(
    differenceDic,
    0.02,
  )
  // create new dic
  const newTags: GenericTag = {}
  differenceCirclePackaging.getLeafNodes().forEach((node) => {
    newTags[node.name] = node.color
  })

  // calculate similarities between connection tags
  const similarityDic = getSimilarityDic(parsedGames, true)
  const circlePackaging = CirclePackaging.fromSimilarityDic(similarityDic, 0.2)

  // fill data
  const similarityLeaves = circlePackaging.getLeafNodes()
  for (let i = 0; i < similarityLeaves.length; i++) {
    similarityLeaves[i].color = newTags[similarityLeaves[i].name]
  }
  circlePackaging.updateColorsFromLeafNodes()

  const appearances = getAppearances(gameTags)
  circlePackaging.setAppearances(appearances)

  // Edge bundling

  const connections = getConnections(parsedGames)
  const edgeBundling = new EdgeBundling(
    'root',
    Object.keys(connections).map(
      (member) =>
        new EdgeBundling(
          member,
          [],
          connections[member]
            ? Object.entries(connections[member]).map(([key, value]) => ({
                name: key,
                amount: value,
              }))
            : [],
          tags[member],
          newTags[member],
        ),
    ),
    [],
  )

  return { circlePackaging, edgeBundling }
}
