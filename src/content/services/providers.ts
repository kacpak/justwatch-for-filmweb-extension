const providerIdToName = {
  2: 'iTunes',
  3: 'Google Play',
  7: 'Vudu',
  8: 'Netflix',
  9: 'Amazon Prime',
  10: 'Amazon',
  15: 'Hulu',
  40: 'Chili',
  68: 'Microsoft Store',
  105: 'FandangoNow',
  192: 'YouTube',
  194: 'Amazon Prime',
  200: 'Amazon Prime',
  204: 'Amazon Prime',
  212: 'hoopla',
  290: 'Amazon Prime',
  337: 'Disney Plus',
  384: 'HBOMax',
  505: 'player',
}

export const getProviderName = (id: number): string | undefined =>
  providerIdToName[id as keyof typeof providerIdToName]
