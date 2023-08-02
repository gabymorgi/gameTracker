// import gameTags from './gameTags.json'
const gameTags: any[] = []

interface GameI {
  id: string;
  tags: string[];
}

function getGames() {
  const gamesObject: { [id: string]: string[] } = {}
  gameTags.forEach((game: any) => {
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

export function main() {
  const games = getGames()

  const graph = createGraph(games)

  console.log(graph)

  const cluster = Clustering.hierarchicalClusteringTree(graph, 0.05)
  cluster.assignColors2(0, 300)

  console.log(cluster)
  
  const tagColors = clusterToTagColor(cluster)

  console.log(JSON.stringify(tagColors))

}

export function createGraph(games: GameI[]): Dictionary<Dictionary<number>> {
  // Crear el grafo
  const graph: Dictionary<Dictionary<number>> = {};
  const uniqueTags: string[] = [];

  // extraer todos los tags únicos
  for (const game of games) {
    const tags = game.tags;
    for (const tag of tags) {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag);
      }
    }
  }

  // Añadir todos los tags al grafo
  for (const tag of uniqueTags) {
    graph[tag] = {};

    for (const otherTag of uniqueTags) {
      graph[tag][otherTag] = 0;
    }
  }

  
  for (const game of games) {
    const tags = game.tags;
  
    // Añadir aristas entre todos los pares de tags para este juego
    for (let i = 0; i < tags.length; i++) {
      for (let j = i+1; j < tags.length; j++) {
        graph[tags[i]][tags[j]] += 1;
        graph[tags[j]][tags[i]] += 1;
      }
    }
  }

  // Normalizar el grafo
  for (const node in graph) {
    const edges = graph[node];
    for (const edge in edges) {
      if (edges[edge] > 0) {
        graph[node][edge] = 1 / edges[edge];
      } else {
        graph[node][edge] = 2;
      }
    }
  }


  return graph;
}

type Dictionary<T> = { [key: string]: T };

class Cluster {
    public threshold: number;
    public members: string[];
    public clusters: Cluster[];
    public colorRange: { start: number; end: number };

    constructor(threshold: number, members: string[]) {
        this.threshold = threshold;
        this.members = members;
        this.clusters = [];
        this.colorRange = { start: 0, end: 0 };
    }

    countLeaves(): number {
      if (this.clusters.length === 0) {
        return 1;
      } else {
        return this.clusters.reduce((acc, cluster) => acc + cluster.countLeaves(), 0);
      }
    }  

    assignColors(start: number, end: number) {
      this.colorRange = { start, end };

      if (this.clusters.length == 0) {
        return;
      }

      let total = 0;
      const thresholdDiffs = [];
  
      // Calcular la diferencia de threshold y su inverso para cada cluster
      for (const cluster of this.clusters) {
        const diff = 1 / (cluster.threshold - this.threshold);
        thresholdDiffs.push(diff);
        total += diff;
      }
  
      // Asignar rangos de colores en función de las diferencias de threshold
      let current = start;
      for (let i = 0; i < this.clusters.length; i++) {
        const proportion = thresholdDiffs[i] / total;
        const colorRange = (end - start) * proportion;
  
        this.clusters[i].colorRange = {
          start: current,
          end: current + colorRange
        };
  
        // Asignar colores a subclusters
        this.clusters[i].assignColors(current, current + colorRange);
  
        current += colorRange;
      }
    }

    assignColors2(start: number, end: number, cantLeaves?: number, currentLeaves: number = 0): number {
      const totalLeaves = cantLeaves || this.countLeaves();
      // si es hoja
      if (this.clusters.length == 0) {
        // asignar range segun el currentLeaves y el totalLeaves
        const colorStep = (end - start) / totalLeaves;
        this.colorRange = {
          start: currentLeaves * colorStep,
          end: (currentLeaves + 1) * colorStep
        };
        currentLeaves++;
      } else {
        this.colorRange = { start, end };
        for (const cluster of this.clusters) {
          currentLeaves = cluster.assignColors2(start, end, totalLeaves, currentLeaves);
        }
      }
      return currentLeaves;
    }
}

class Clustering {

  static hierarchicalClustering(similarityDic: Dictionary<Dictionary<number>>, threshold: number) : string[][] {
      const keys = Object.keys(similarityDic);
      const clusters: string[][] = keys.map(key => [key]);

      while (clusters.length > 1) {
          let maxSim = 0, maxI = 0, maxJ = 0;
          for (let i = 0; i < clusters.length; i++) {
              for (let j = i + 1; j < clusters.length; j++) {
                  const sim = this.averageLinkage(similarityDic, clusters[i], clusters[j]);
                  if (sim > maxSim) {
                      maxSim = sim;
                      maxI = i;
                      maxJ = j;
                  }
              }
          }

          if (maxSim < threshold)
              break;

          const newCluster = clusters[maxI].concat(clusters[maxJ]);
          clusters.splice(maxJ, 1);
          clusters.splice(maxI, 1);
          clusters.push(newCluster);
      }

      return clusters;
  }

  private static averageLinkage(similarityMatrix: Dictionary<Dictionary<number>>, cluster1: string[], cluster2: string[]) {
      let sim = 0;
      for (const p1 of cluster1) {
          for (const p2 of cluster2) {
              sim += similarityMatrix[p1][p2];
          }
      }
      sim /= (cluster1.length * cluster2.length);
      return sim;
  }

  static hierarchicalClusteringTree(similarityDic: Dictionary<Dictionary<number>>, thresholdStep: number = 0.1) {
      const allMembers = Object.keys(similarityDic);
      const rootNode = new Cluster(0, allMembers);
      this.buildClusterTree(similarityDic, rootNode, thresholdStep);
      return rootNode;
  }

  private static buildClusterTree(similarityDic: Dictionary<Dictionary<number>>, parentNode: Cluster, thresholdStep: number) {
      if (parentNode.members.length == 1)
          return;

      let currentThreshold = parentNode.threshold + thresholdStep;
      let clusters = this.hierarchicalClustering(similarityDic, currentThreshold);

      while (clusters.length == 1) {
          parentNode.threshold = currentThreshold;
          currentThreshold += thresholdStep;
          clusters = this.hierarchicalClustering(similarityDic, currentThreshold);
      }

      if (clusters.length >= Object.keys(similarityDic).length)
          return;

      parentNode.clusters = clusters.map(cluster => new Cluster(currentThreshold, cluster));

      parentNode.clusters.forEach(childNode => {
          if (childNode.members.length == 1)
              return;

          const subSimilarityDic = this.createSubSimilarityDic(similarityDic, childNode.members);
          this.buildClusterTree(subSimilarityDic, childNode, thresholdStep);
      });
  }

  private static createSubSimilarityDic(similarityDic: Dictionary<Dictionary<number>>, members: string[]) : Dictionary<Dictionary<number>> {
      const result: Dictionary<Dictionary<number>> = {};
      for (const member of members) {
          result[member] = {};
          for (const otherMember of members) {
              result[member][otherMember] = similarityDic[member][otherMember];
          }
      }
      return result;
  }
}

function clusterToTagColor(cluster: Cluster): Dictionary<number> {
  const result: Dictionary<number> = {};
  // si es hoja
  if (cluster.clusters.length == 0) {
    // dividir el rango de colores en el número de miembros + 1
    const colorRange = (cluster.colorRange.end - cluster.colorRange.start) / (cluster.members.length + 1);
    // por cada miembro asignarle un color
    for (let i = 0; i < cluster.members.length; i++) {
      result[cluster.members[i]] = Math.round(cluster.colorRange.start + (i + 1) * colorRange);
    }
  } else {
    // si no es hoja, asignar colores a los subclusters
    for (const subcluster of cluster.clusters) {
      const subclusterColors = clusterToTagColor(subcluster);
      for (const tag in subclusterColors) {
        result[tag] = subclusterColors[tag];
      }
    }
  }

  return result;
}