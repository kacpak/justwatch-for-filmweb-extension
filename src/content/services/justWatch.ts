import {
  SearchResponseDTO,
  OfferDTO,
  MonetizationType,
  ItemDTO,
} from '../models/SearchResponseDTO'
import { ItemModel, OfferModel } from '../models/ItemModel'
import { Movie } from '../models/Movie'
import { getItem, setItem } from '../storage'

export interface JustWatchResult {
  movies: ItemModel[]
  updatedAt: number
  expiresAt: number
}

export async function queryJustWatch(
  movie: Movie,
  locale: string = 'en_US',
): Promise<JustWatchResult> {
  const cacheId = `${movie.id}:${locale}`
  const cachedValue = await getItem<JustWatchResult>(cacheId)

  if (cachedValue && new Date() < new Date(cachedValue.expiresAt)) {
    // return cachedValue
  }

  const items = await search(movie.title, locale)
  const value: JustWatchResult = {
    movies: items,
    updatedAt: Date.now(),
    expiresAt: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ).getTime(),
  }

  await setItem(cacheId, value)
  return value
}

function search(query: string, locale: string = 'en_US'): Promise<ItemModel[]> {
  return fetch(`https://apis.justwatch.com/content/titles/${locale}/popular`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then(({ items }: SearchResponseDTO) => {
      return items.map((item) => mapItemResponseToModel(item, locale))
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
  { id, title, offers = [], tmdb_popularity }: ItemDTO,
  locale: string,
): ItemModel {
  return {
    id,
    popularity: tmdb_popularity,
    title,
    flatrate: extractMonetizationTypeOffers(offers, 'flatrate', locale),
    rent: extractMonetizationTypeOffers(offers, 'rent', locale),
  }
}
