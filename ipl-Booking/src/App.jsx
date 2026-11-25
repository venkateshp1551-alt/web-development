
import { useState, useEffect, useCallback } from 'react'

import { supabase } from './superbase'

import BookingForm from './components/bookingForm'
import Footer from './components/footer'
import MatchCard from './components/MatchCard'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

import './App.css'

function App() {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Fetch matches from Supabase
  const fetchMatches = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id')

    if (error) {
      console.error('Supabase Fetch Error:', error)
      setErrorMessage(error.message)
      setMatches([])
    } else {
      console.log('Matches received:', data)

      const formattedMatches = data.map((match) => ({
        ...match,
        teamOne: match.team1,
        teamTwo: match.team2,
        date: match.date,
        time: match.time || '',
      }))

      setMatches(formattedMatches)
      setErrorMessage('')
    }

    setLoading(false)
  }, [])

  // 2. Fetch matches and enable realtime updates
  useEffect(() => {
    fetchMatches()

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          fetchMatches()
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchMatches])

  // 3. Open booking form
  const openBooking = (match) => {
    setSuccessMessage('')
    setErrorMessage('')

    setSelectedMatch({
      ...match,
      title: `${match.teamOne} vs ${match.teamTwo}`,
    })
  }

  // 4. Close booking form
  const closeBooking = () => {
    setSelectedMatch(null)
    setErrorMessage('')
  }

  // 5. Book tickets using Supabase
  const handleBooking = async (booking) => {
    if (!selectedMatch) return

    const quantity = Number(booking.quantity)

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      setErrorMessage('Please select between 1 and 10 tickets.')
      return
    }

    if (quantity > selectedMatch.available_seats) {
      setErrorMessage('Not enough seats available.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    // Update available seats
    const { data: updatedMatch, error: updateError } =
      await supabase
        .from('matches')
        .update({
          available_seats:
            selectedMatch.available_seats - quantity,
        })
        .eq('id', selectedMatch.id)
        .gte('available_seats', quantity)
        .select()
        .maybeSingle()

    if (updateError || !updatedMatch) {
      console.error('Seat Update Error:', updateError)
      setErrorMessage(
        updateError?.message || 'Unable to reserve seats. Please try again.'
      )
      await fetchMatches()
      return
    }

    // Insert booking into bookings table
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        match_id: selectedMatch.id,
        user_name: booking.name,
        match_title: selectedMatch.title,
        tickets: quantity,
        total_price: selectedMatch.price * quantity,
      })

    if (bookingError) {
      console.error('Booking Error:', bookingError)

      // Restore seats if booking insertion fails
      const { error: rollbackError } = await supabase
        .from('matches')
        .update({
          available_seats: updatedMatch.available_seats + quantity,
        })
        .eq('id', selectedMatch.id)

      if (rollbackError) {
        console.error('Seat Restoration Error:', rollbackError)
      }

      setErrorMessage(bookingError.message)
      await fetchMatches()
      return
    }

    // Booking successful
    setSuccessMessage(
      `Booking confirmed for ${booking.name}. ${quantity} ticket(s) booked.`
    )

    setSelectedMatch(null)

    // Refresh match data
    await fetchMatches()
  }

  return (
    <div className="app">

      <Navbar />

      <Hero />

      <main>

        {/* Success message */}
        {successMessage && (
          <p className="booking-success" role="status">
            {successMessage}
          </p>
        )}

        {/* Error message */}
        {errorMessage && (
          <p className="booking-error" role="alert">
            {errorMessage}
          </p>
        )}

        <h2>Available IPL Matches</h2>

        {/* Display matches from Supabase */}
        {loading ? (
          <p>Loading matches...</p>
        ) : (
          <section
            className="matches-grid"
            id="matches"
            aria-label="Available matches"
          >
            {matches.length === 0 ? (
              <p>No matches available.</p>
            ) : (
              matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onBook={openBooking}
                />
              ))
            )}
          </section>
        )}

        {/* Booking modal */}
        {selectedMatch && (
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="booking-modal-content">

              <BookingForm
                match={selectedMatch}
                price={selectedMatch.price}
                onSubmit={handleBooking}
                onCancel={closeBooking}
              />

            </div>
          </div>
        )}

      </main>

      <Footer />

    </div>
  )
}

export default App
