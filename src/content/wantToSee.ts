import { Movie } from './models/Movie'
import { injectCardIntoMovieEntry } from './Card'
import { queryJustWatchForMultipleLocales } from './services/justWatch'
import { sortByMostMatchingTitle } from './utils/sorter'

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
    year: element.querySelector<HTMLDivElement>('.filmPreview__year')!
      .innerText,
    element,
  }))
}

async function main() {
  for (const movie of getMovies()) {
    try {
      const movieSearchResult = sortByMostMatchingTitle(
        movie,
        await queryJustWatchForMultipleLocales(movie),
      )
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
