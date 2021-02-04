import { distance } from 'fastest-levenshtein'
import { Movie } from '../models/Movie'
import { JustWatchResult } from '../services/justWatch'

export function sortByMostMatchingTitle(
  movie: Movie,
  justWatchResult: JustWatchResult,
): JustWatchResult {
  const arr = justWatchResult.movies.map((foundMovie) => {
    const smallestLevenshteinDistance = Math.min(
      distance(
        `${movie.title} - ${movie.year}`,
        `${foundMovie.title} - ${foundMovie.releaseYear}`,
      ),
      movie.originalTitle
        ? distance(
            `${movie.originalTitle} - ${movie.year}`,
            `${foundMovie.title} - ${foundMovie.releaseYear}`,
          )
        : Infinity,
    )
    return {
      foundMovie,
      smallestLevenshteinDistance,
    }
  })
  arr.sort(
    (a, b) => a.smallestLevenshteinDistance - b.smallestLevenshteinDistance,
  )
  return {
    ...justWatchResult,
    movies: arr.map((e) => e.foundMovie),
  }
}
