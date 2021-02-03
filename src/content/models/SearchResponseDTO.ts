export interface SearchResponseDTO {
  total_results: number;
  items: ItemDTO[];
}

export interface ItemDTO {
  jw_entity_id: string;
  id: number;
  title: string;
  full_path: string;
  full_paths: FullpathsDTO;
  poster: string;
  poster_blur_hash: string;
  original_release_year: number;
  tmdb_popularity: number;
  object_type: string;
  offers?: OfferDTO[];
  scoring: ScoringDTO[];
  localized_release_date?: string;
  cinema_release_date?: string;
}

export interface ScoringDTO {
  provider_type: string;
  value: number;
}

export type MonetizationType = "rent" | "flatrate" | "buy" | "ads";

export interface OfferDTO {
  monetization_type: MonetizationType;
  provider_id: number;
  retail_price?: number;
  currency: string;
  urls: UrlsDTO;
  presentation_type: string;
  last_change_retail_price?: number;
  last_change_difference?: number;
  last_change_percent?: number;
  last_change_date?: string;
  last_change_date_provider_id?: string;
  type?: string;
  element_count?: number;
  new_element_count?: number;
}

export interface UrlsDTO {
  standard_web: string;
}

export interface FullpathsDTO {
  MOVIE_DETAIL_OVERVIEW?: string;
  SHOW_DETAIL_OVERVIEW?: string;
}
