export interface OfferModel {
  providerId: number
  url?: string
  locale: string
}

export interface ItemModel {
  id: number
  title: string
  flatrate: OfferModel[]
  rent: OfferModel[]
  popularity: number
  releaseYear: number
}
