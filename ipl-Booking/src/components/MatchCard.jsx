function MatchCard({ match, onBook }) {
  if (!match) return null

  const {
    teamOne,
    teamTwo,
    date,
    time,
    venue,
    price,
  } = match

  return (
    <article className="match-card">
      <header className="match-card-header">
        <h2>{teamOne || 'Team 1'} vs {teamTwo || 'Team 2'}</h2>
      </header>

      <div className="match-card-details">
        {date && (
          <p>
            <strong>Date:</strong> {date}
          </p>
        )}
        {time && (
          <p>
            <strong>Time:</strong> {time}
          </p>
        )}
        {venue && (
          <p>
            <strong>Venue:</strong> {venue}
          </p>
        )}
        {price !== undefined && (
          <p className="match-price">
            <strong>From:</strong> {price}
          </p>
        )}
      </div>

      {onBook && (
        <button type="button" onClick={() => onBook(match)}>
          Book Tickets
        </button>
      )}
    </article>
  )
}

export default MatchCard