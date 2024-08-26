import { hsl, lab } from 'd3-color'

const step = 1
let distances: number[]

function getDistances() {
  if (!distances) {
    distances = []
    for (let i = 0; i < 360; i += step) {
      const distance = colorDistance(
        `hsl(${i}, 100%, 50%)`,
        `hsl(${i + step}, 100%, 50%)`,
      )
      distances.push(distance)
    }
  }
  return distances
}

function colorDistance(color1: string, color2: string): number {
  // Convertir los colores HSL a objetos de color LAB usando d3-color
  const lab1 = lab(hsl(color1))
  const lab2 = lab(hsl(color2))

  // Calcular la distancia euclidiana entre los dos colores en el espacio LAB
  return Math.sqrt(
    Math.pow(lab2.l - lab1.l, 2) +
      Math.pow(lab2.a - lab1.a, 2) +
      Math.pow(lab2.b - lab1.b, 2),
  )
}

export function findDivisions(numSections: number): number[] {
  getDistances()

  if (distances.length < numSections) {
    throw new Error(
      'The number of distances must be greater than or equal to the number of sections',
    )
  }
  if (distances.length === numSections) {
    return Array.from({ length: numSections - 1 }, (_, i) => i + 1)
  }
  const totalSum = distances.reduce((acc, val) => acc + val, 0)
  const targetSum = totalSum / numSections
  let currentSum = 0
  const divisions: number[] = []

  for (let i = 0; i < distances.length; i++) {
    currentSum += distances[i]

    if (currentSum > targetSum) {
      const dif1 = Math.abs(currentSum - targetSum)
      const dif2 = Math.abs(currentSum - distances[i] - targetSum)
      if (dif1 > dif2) {
        divisions.push(i - 1)
        currentSum = distances[i]
      } else {
        divisions.push(i)
        currentSum = 0
      }
    }

    if (divisions.length >= numSections - 1) break
  }

  return divisions
}

export function findCut(percentage: number): number {
  getDistances()

  const totalSum = distances.reduce((acc, val) => acc + val, 0)
  const targetSum = totalSum * percentage
  let currentSum = 0

  for (let i = 0; i < distances.length; i++) {
    currentSum += distances[i]

    if (currentSum > targetSum) {
      const dif1 = Math.abs(currentSum - targetSum)
      const dif2 = Math.abs(currentSum - distances[i] - targetSum)
      if (dif1 > dif2) {
        return i - 1
      } else {
        return i
      }
    }
  }

  return 0
}