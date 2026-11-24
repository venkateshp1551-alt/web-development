import { useState } from 'react'
import BookingForm from './components/bookingForm'
import Footer from './components/footer'
import MatchCard from './components/MatchCard'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

const matches = [
  {
    id: 1,
    teamOne: 'Mumbai Indians',
    teamTwo: 'Chennai Super Kings',
    date: '10 April 2027',
    time: '7:30 PM',
    venue: 'Wankhede Stadium',
    price: 1500,
  },
  {
    id: 2,
    teamOne: 'Royal Challengers Bengaluru',
    teamTwo: 'Kolkata Knight Riders',
    date: '12 April 2027',
    time: '7:30 PM',
    venue: 'M. Chinnaswamy Stadium',
    price: 1200,
  },
  {
    id: 3,
    teamOne: 'Sunrisers Hyderabad',
    teamTwo: 'Rajasthan Royals',
    date: '15 April 2027',
    time: '3:30 PM',
    venue: 'Rajiv Gandhi Stadium',
    price: 1000,
  },
]

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const openBooking = (match) => {
    setSuccessMessage('')
    setSelectedMatch({
      ...match,
      title: `${match.teamOne} vs ${match.teamTwo}`,
    })
  }

  const closeBooking = () => setSelectedMatch(null)

  const handleBooking = async (booking) => {
    setSuccessMessage(
      `Booking confirmed for ${booking.name}. ${booking.quantity} ticket(s) booked.`,
    )
    setSelectedMatch(null)
  }

  return (
    <div className="app">
      <Navbar />
<Hero />

      <main>
        {successMessage && (
          <p className="booking-success" role="status">
            {successMessage}
          </p>
        )}

        <section
  className="matches-grid"
  id="matches"
  aria-label="Available matches"
>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onBook={openBooking}
            />
          ))}
        </section>

        {selectedMatch && (
          <div className="booking-modal" role="dialog" aria-modal="true">
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