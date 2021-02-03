import { Movie } from './models/Movie'
import { injectCardIntoMovieEntry } from './Card'
import { JustWatchResult, queryJustWatch } from './services/justWatch'
import { ItemModel } from './models/ItemModel'

function getMovies(): Movie[] {
  return Array.from(
    document.querySelectorAll<HTMLDivElement>('.filmPreview'),
  ).map((element) => ({
    id: element.dataset.id!,
    title: element.querySelector<HTMLDivElement>('.filmPreview__title')!
      .innerText,
    originalTitle: element.querySelector<HTMLDivElement>(
      '.filmPreview__originalTitle',
    )?.innerText,
    element,
  }))
}

async function queryJustWatchForMultipleLocales(
  movie: Movie,
  locales = ['pl_PL', 'en_US', 'en_GB', 'en_CA'],
): Promise<JustWatchResult> {
  const itemsMap = new Map<number, ItemModel>()
  for (const locale of locales) {
    const result = await queryJustWatch(movie, locale)

    result.movies.forEach((movie) => {
      const item: ItemModel = itemsMap.has(movie.id)
        ? itemsMap.get(movie.id)!
        : {
            id: movie.id,
            title: movie.title,
            popularity: movie.popularity,
            flatrate: [],
            rent: [],
          }

      item.rent.push(...movie.rent)
      item.flatrate.push(...movie.flatrate)

      itemsMap.set(movie.id, item)
    })
  }

  return {
    movies: Array.from(itemsMap.values()),
    expiresAt: 1,
    updatedAt: 1,
  }
}

async function main() {
  for (const movie of getMovies()) {
    try {
      const movieSearchResult = await queryJustWatchForMultipleLocales(movie)
      injectCardIntoMovieEntry(movie, movieSearchResult)
    } catch (e) {
      console.error(
        `There was an error querying JustWatch service for "${movie.title}"`,
        e,
      )
    }
  }
}

main()
