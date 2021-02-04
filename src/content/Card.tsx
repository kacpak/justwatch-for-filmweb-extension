import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { Movie } from './models/Movie'
import styles from './Card.module.scss'
import { JustWatchResult } from './services/justWatch'
import { ItemModel, OfferModel } from './models/ItemModel'
import { getProviderName } from './services/providers'

const TITLES_COUNT = 1

const itemHasOffers = (item: ItemModel) =>
  item.flatrate.length || item.rent.length

function getHostFromUrl(url?: string): string | undefined {
  if (!url) {
    return
  }
  try {
    return new URL(url).host
  } catch (e) {
    return url
  }
}

interface MovieOfferTypeRowProps {
  offers: OfferModel[]
  label: string
}
function MovieOfferTypeRow({ offers, label }: MovieOfferTypeRowProps) {
  if (!offers.length) {
    return null
  }

  const getLabel = (offer: OfferModel) =>
    getProviderName(offer.providerId) ??
    `${getHostFromUrl(offer.url)} (${offer.providerId})`

  return (
    <div className={styles.offerTypeRow}>
      <div className={styles.offerType}>{label}</div>
      <div className={styles.offerList}>
        {offers.map((offer, index) => (
          <a key={index} href={offer.url}>
            {getLabel(offer)} [{offer.locale.slice(3)}]
          </a>
        ))}
      </div>
    </div>
  )
}

interface CardProps {
  movie: Movie
  justWatchResult: JustWatchResult
}
function Card({ movie, justWatchResult }: CardProps) {
  const [showAll, setShowAll] = useState(false)
  const movies = showAll
    ? justWatchResult.movies
    : justWatchResult.movies.slice(0, TITLES_COUNT)

  if (movies.length === 0) {
    return <span>There were no movies found in JustWatch database</span>
  }

  return (
    <>
      {movies.map((movie) => (
        <div key={movie.id} className={styles.row}>
          <div className={styles.title}>
            {movie.title} [{movie.releaseYear}]
          </div>
          {itemHasOffers(movie) ? (
            <>
              <MovieOfferTypeRow label={'Stream'} offers={movie.flatrate} />
              <MovieOfferTypeRow label={'Rent'} offers={movie.rent} />
            </>
          ) : (
            <div>There are no offers for this movie</div>
          )}
        </div>
      ))}
      {justWatchResult.movies.length > TITLES_COUNT && (
        <div className={styles.showMore}>
          <button onClick={() => setShowAll((b) => !b)}>
            {showAll ? 'Show less ↑' : 'Show more ↓'}
          </button>
        </div>
      )}
    </>
  )
}

export function injectCardIntoMovieEntry(
  movie: Movie,
  justWatchResult: JustWatchResult,
) {
  const leftBox = movie.element.parentElement!.parentElement!
  const cardContainer = document.createElement('div')
  cardContainer.classList.add(styles.container)
  leftBox.appendChild(cardContainer)
  ReactDOM.render(
    <Card movie={movie} justWatchResult={justWatchResult} />,
    cardContainer,
  )
}
