import { Movie } from './models/Movie'
import { injectCardIntoMovieEntry } from './Card'
import { queryJustWatch } from './services/justWatch'

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

async function main() {
  for (const movie of getMovies()) {
    // const movieSearchResult = await queryJustWatchForMultipleLocales(movie);
    try {
      const movieSearchResult = await queryJustWatch(movie)
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
