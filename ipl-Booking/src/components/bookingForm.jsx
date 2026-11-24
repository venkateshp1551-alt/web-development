import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  quantity: 1,
  stand: 'General',
}

function BookingForm({ match, price = 0, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'quantity' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.quantity < 1 || form.quantity > 10) {
      setError('Please select between 1 and 10 tickets.')
      return
    }

    setSubmitting(true)
    try {
      const booking = {
        ...form,
        matchId: match?.id,
        match: match?.title,
        totalAmount: price * form.quantity,
      }

      if (onSubmit) {
        await onSubmit(booking)
      }
    } catch (submitError) {
      setError(submitError?.message || 'Could not complete the booking.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book Tickets</h2>

      {match?.title && (
        <p className="booking-match">
          <strong>{match.title}</strong>
          {match.venue ? ` - ${match.venue}` : ''}
          {match.date ? ` - ${match.date}` : ''}
        </p>
      )}

      <label htmlFor="booking-name">Full name</label>
      <input
        id="booking-name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />

      <label htmlFor="booking-email">Email address</label>
      <input
        id="booking-email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
        required
      />

      <label htmlFor="booking-phone">Phone number</label>
      <input
        id="booking-phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
        required
      />

      <label htmlFor="booking-stand">Stand</label>
      <select
        id="booking-stand"
        name="stand"
        value={form.stand}
        onChange={handleChange}
      >
        <option value="General">General</option>
        <option value="North">North Stand</option>
        <option value="South">South Stand</option>
        <option value="VIP">VIP</option>
      </select>

      <label htmlFor="booking-quantity">Number of tickets</label>
      <input
        id="booking-quantity"
        name="quantity"
        type="number"
        min="1"
        max="10"
        value={form.quantity}
        onChange={handleChange}
        required
      />

      <p className="booking-total">
        Total: <strong>{price * form.quantity}</strong>
      </p>

      {error && <p role="alert">{error}</p>}

      <div className="booking-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  )
}

export default BookingForm