import tinycolor from 'tinycolor2'

type GenerateOptions = Partial<{
  contrastAgainst: string
  excludedHueRanges: { min: number; max: number }[]
  saturation: number
  lightness: number
}>

export function generateColours(numOfColours: number, options?: GenerateOptions) {
  const colours: string[] = []
  while (colours?.length < numOfColours) {
    const generatedColour = generateColour(options)
    colours.push(generatedColour)
  }

  return colours
}

export function generateColour(options?: GenerateOptions) {
  let chosenColour = null

  let retries = 10
  while (retries > 0) {
    const baseColour = tinycolor.random()
    const { h } = baseColour.toHsl()

    // Adjust saturation
    if (options?.saturation) {
      baseColour.saturate(options.saturation)
    }

    // Adjust lightness
    if (options?.lightness) {
      baseColour.lighten(options.lightness)
    }

    // Ensure random colour is outside excluded hue ranges
    if (
      options?.excludedHueRanges &&
      options?.excludedHueRanges.some((range) => h >= range.min && h <= range.max)
    ) {
      retries--
      continue
    }

    // Ensure the random colour has AAA standard contrast rating against background colour
    if (options?.contrastAgainst && !checkContrast(baseColour.toHex(), options.contrastAgainst)) {
      retries--
      continue
    }

    chosenColour = baseColour
    break
  }

  // If no colour could be generated that matches criteria, default to black
  if (!chosenColour) {
    chosenColour = tinycolor.random().darken(100)
  }

  return chosenColour.toHexString()
}

export function checkContrast(foreground: string, background: string) {
  return tinycolor.isReadable(foreground, background, { level: 'AA', size: 'large' })
}
