import React, { useState } from 'react';

const App = () => {
  const [movie, setMovie] = useState({ id: 'm001', title: 'The Martian', duration: 144, genre: 'Sci-Fi' });
  const [theater, setTheater] = useState({ id: 't001', name: 'Galaxy Cinemas', totalSeats: 250 });
  const [show, setShow] = useState({
    id: 's001',
    time: new Date(2025, 10, 15, 19, 0),
    availableSeats: { regular: 100, premium: 50 },
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('regular');
  const [message, setMessage] = useState('');

  const formatDate = (date) => {
    return date.toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
  };
  
  const handleSeatsChange = (event) => {
    setSeatsToBook(parseInt(event.target.value));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleBookTickets = () => {
    if (show.availableSeats[selectedCategory] >= seatsToBook) {
      const updatedShow = {
        ...show,
        availableSeats: {
          ...show.availableSeats,
          [selectedCategory]: show.availableSeats[selectedCategory] - seatsToBook,
        },
      };
      setShow(updatedShow);

      const newBooking = {
        id: Date.now(),
        seats: seatsToBook,
        category: selectedCategory,
        showId: show.id,
      };

      setBookingHistory([...bookingHistory, newBooking]);
      setMessage(`✅ Success! Booked ${seatsToBook} ${selectedCategory} ticket(s).`);

    } else {
      setMessage(`❌ Booking failed. Not enough ${selectedCategory} seats available.`);
    }
  };

  // NEW: Function to handle booking cancellation
  const handleCancelBooking = (bookingToCancel) => {
    // 1. Return seats to the show's available seats
    const updatedShow = {
      ...show,
      availableSeats: {
        ...show.availableSeats,
        [bookingToCancel.category]: show.availableSeats[bookingToCancel.category] + bookingToCancel.seats,
      },
    };
    setShow(updatedShow);
    
    // 2. Filter out the booking from the history (create a NEW array)
    const updatedHistory = bookingHistory.filter(booking => booking.id !== bookingToCancel.id);
    setBookingHistory(updatedHistory);
    
    setMessage(`✅ Canceled booking ID: ${bookingToCancel.id}.`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* Movie Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{movie.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{theater.name}</p>
        
        <p className="text-gray-500">{formatDate(show.time)}</p>
        <p className="text-gray-500">Duration: {movie.duration} mins</p>
        <p className="text-gray-500 mb-6">Genre: {movie.genre}</p>
        
        <div className="flex justify-around items-center bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-md text-gray-700 font-semibold">
            Regular Seats: <span className="text-lg text-green-600 font-bold">{show.availableSeats.regular}</span>
          </p>
          <p className="text-md text-gray-700 font-semibold">
            Premium Seats: <span className="text-lg text-green-600 font-bold">{show.availableSeats.premium}</span>
          </p>
        </div>
      </div>
      
      {/* Booking Form Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Book Your Tickets</h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          
          {/* Category Dropdown */}
          <div className="flex flex-col w-full sm:w-1/2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select
              id="category"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="regular">Regular ($15)</option>
              <option value="premium">Premium ($25)</option>
            </select>
          </div>
          
          {/* Number of Seats Input */}
          <div className="flex flex-col w-full sm:w-1/2">
            <label htmlFor="seats" className="text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
            <input
              type="number"
              id="seats"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={seatsToBook}
              onChange={handleSeatsChange}
              min="1"
            />
          </div>
          
        </div>
        
        {/* Book Button */}
        <button 
          onClick={handleBookTickets} 
          className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Book Now
        </button>

        {/* Display Message */}
        {message && (
          <p className={`mt-4 text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Booking History Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Bookings</h2>
        {/* Check if there are any bookings to display */}
        {bookingHistory.length === 0 ? (
          <p className="text-center text-gray-500">You have no bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {/* Loop through the bookingHistory array and create a list item for each booking */}
            {bookingHistory.map((booking) => (
              <li key={booking.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800">
                    {booking.seats} {booking.category} seat{booking.seats > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                </div>
                <p className={`font-bold ${booking.category === 'premium' ? 'text-indigo-600' : 'text-gray-600'}`}>
                  ${booking.category === 'regular' ? booking.seats * 15 : booking.seats * 25}
                </p>
                 {/* NEW: Cancel Button */}
                 <button 
                   onClick={() => handleCancelBooking(booking)}
                   className="py-1 px-3 ml-4 text-sm font-semibold text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                 >
                   Cancel
                 </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default App;
