interface MemoItem {
  word: string
  phrases: {
    content: string
  }[]
  priority?: number
}

export function parseWordsData(
  input: string,
  freqData: { [key: string]: number },
): MemoItem[] {
  // Separar cada entrada por dos saltos de línea.
  const items = input.match(/(\d+\..*?)(?=(\r?\n){2,}\d+\.|$)/gs)

  return (
    items?.map((item) => {
      const word = item.match(/\(([^)]+)\)/)?.[1]

      const phrases = item.split(/\r?\n/).slice(1) // Aquí dividimos por cualquier final de línea y ignoramos la primera
      const parsed: MemoItem = {
        word: word ?? '---',
        phrases: phrases
          .map((phrase) => {
            // Removemos números al principio si están presentes
            return {
              content: phrase.replace(/^\d+\)\s*/, ''),
            }
          })
          .filter((phrase) => {
            // Removemos frases vacías
            return phrase.content.length > 0
          }),
      }

      parsed.priority =
        Number(freqData[parsed.word] || 0) + parsed.phrases.length + 3

      return parsed
    }) ?? []
  )
}

export function parseClippingData(input: string): string[] {
  const matches = input.matchAll(/^\d+\.\s(.*?)(?=\r?\n|$)/gm)

  return Array.from(matches, (match) => match[1])
}
