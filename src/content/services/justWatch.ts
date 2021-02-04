import {
  SearchResponseDTO,
  OfferDTO,
  MonetizationType,
  ItemDTO,
} from '../models/SearchResponseDTO'
import { ItemModel, OfferModel } from '../models/ItemModel'
import { Movie } from '../models/Movie'
import { getItem, setItem } from '../utils/storage'

export interface JustWatchResult {
  movies: ItemModel[]
  updatedAt: number
  expiresAt: number
}

export async function queryJustWatchForMultipleLocales(
  movie: Movie,
  locales = ['pl_PL', 'en_US', 'en_GB', 'en_CA', 'en_AU'],
): Promise<JustWatchResult> {
  const itemsMap = new Map<number, ItemModel>()
  let expiresAt = Infinity
  let updatedAt = Infinity

  for (const locale of locales) {
    const result = await queryJustWatch(movie, locale)

    expiresAt = Math.min(expiresAt, result.expiresAt)
    updatedAt = Math.min(updatedAt, result.updatedAt)

    result.movies.forEach((movie) => {
      const item: ItemModel = itemsMap.has(movie.id)
        ? itemsMap.get(movie.id)!
        : {
            id: movie.id,
            title: movie.title,
            popularity: movie.popularity,
            flatrate: [],
            rent: [],
            releaseYear: movie.releaseYear,
          }

      item.rent.push(...movie.rent)
      item.flatrate.push(...movie.flatrate)

      itemsMap.set(movie.id, item)
    })
  }

  return {
    movies: Array.from(itemsMap.values()),
    expiresAt,
    updatedAt,
  }
}

async function queryJustWatch(
  movie: Movie,
  locale: string = 'en_US',
): Promise<JustWatchResult> {
  const { response, expiresAt, queriedAt } = await search(movie, locale)

  return {
    movies: response.items.map((item) => mapItemResponseToModel(item, locale)),
    updatedAt: queriedAt,
    expiresAt,
  }
}

interface CachedSearchResponse {
  response: SearchResponseDTO
  queriedAt: number
  expiresAt: number
}

async function search(
  movie: Movie,
  locale: string = 'en_US',
): Promise<CachedSearchResponse> {
  const cacheId = `${movie.id}:${locale}`
  const cachedValue = await getItem<CachedSearchResponse>(cacheId)

  if (cachedValue && new Date() < new Date(cachedValue.expiresAt)) {
    return cachedValue
  }

  return fetch(`https://apis.justwatch.com/content/titles/${locale}/popular`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: movie.title }),
  })
    .then((res) => res.json())
    .then(async (response: SearchResponseDTO) => {
      const items = response.items.slice(0, 10)
      const value: CachedSearchResponse = {
        response: {
          total_results: response.total_results,
          items,
        },
        queriedAt: Date.now(),
        expiresAt: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ).getTime(),
      }

      await setItem(cacheId, value)
      return value
    })
}

function extractMonetizationTypeOffers(
  offers: OfferDTO[],
  type: MonetizationType,
  locale: string,
): OfferModel[] {
  const offersOfType = offers.filter(
    (offer) => offer.monetization_type === type,
  )

  const offersMap = offersOfType.reduce((map, offer) => {
    if (!map.has(offer.provider_id)) {
      map.set(offer.provider_id, {
        providerId: offer.provider_id,
        url: offer?.urls?.standard_web,
        locale,
      })
    }

    return map
  }, new Map<number, OfferModel>())

  return Array.from(offersMap.values())
}

export function mapItemResponseToModel(
  { id, title, offers = [], tmdb_popularity, original_release_year }: ItemDTO,
  locale: string,
): ItemModel {
  return {
    id,
    popularity: tmdb_popularity,
    title,
    flatrate: extractMonetizationTypeOffers(offers, 'flatrate', locale),
    rent: extractMonetizationTypeOffers(offers, 'rent', locale),
    releaseYear: original_release_year,
  }
}
