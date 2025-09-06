import React, { useState } from 'react';

const App = () => {
  // NEW: We now have an array of shows instead of just one.
  const [shows, setShows] = useState([
    {
      id: 's001',
      title: 'The Martian',
      theater: 'Galaxy Cinemas',
      time: new Date(2025, 10, 15, 19, 0),
      availableSeats: { regular: 100, premium: 50 },
      genre: 'Sci-Fi',
      duration: 144
    },
    {
      id: 's002',
      title: 'Inception',
      theater: 'Main Street Theater',
      time: new Date(2025, 10, 15, 21, 30),
      availableSeats: { regular: 80, premium: 40 },
      genre: 'Sci-Fi',
      duration: 148
    },
    {
      id: 's003',
      title: 'Hello Brother',
      theater: 'Cineplex',
      time: new Date(2025, 10, 16, 17, 0),
      availableSeats: { regular: 120, premium: 60 },
      genre: 'Comedy',
      duration: 120
    },
    {
      id:'s004',
      title:'Avatar',
      theater: 'Inox',
      time: new Date(2025, 10, 16, 17, 0),
      availableSeats: { regular: 150, premium: 50 },
      genre: 'Sci_fi',
      duration: 144
    }
  ]);

  // NEW: State to keep track of the currently selected show.
  // We'll select the first show by default.
  const [selectedShow, setSelectedShow] = useState(shows[0]);

  // State for our booking history and form inputs.
  const [bookingHistory, setBookingHistory] = useState([]);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('regular');
  const [message, setMessage] = useState('');

  const formatDate = (date) => {
    return date.toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
  };
  
  // A function to handle changes in the number input
  const handleSeatsChange = (event) => {
    setSeatsToBook(parseInt(event.target.value));
  };

  // A function to handle changes in the dropdown
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleBookTickets = () => {
    if (selectedShow.availableSeats[selectedCategory] >= seatsToBook) {
      // Find the index of the selected show in our array
      const showIndex = shows.findIndex(s => s.id === selectedShow.id);
      
      // Create a NEW object for the updated show
      const updatedShow = {
        ...selectedShow,
        availableSeats: {
          ...selectedShow.availableSeats,
          [selectedCategory]: selectedShow.availableSeats[selectedCategory] - seatsToBook,
        },
      };
      
      // Update the main shows array with the updated show
      const updatedShows = [...shows];
      updatedShows[showIndex] = updatedShow;
      setShows(updatedShows);
      
      // Update the selectedShow state to reflect the change
      setSelectedShow(updatedShow);

      const newBooking = {
        id: Date.now(),
        seats: seatsToBook,
        category: selectedCategory,
        showId: selectedShow.id,
        title: selectedShow.title,
        time: selectedShow.time,
      };

      setBookingHistory([...bookingHistory, newBooking]);
      setMessage(`✅ Success! Booked ${seatsToBook} ${selectedCategory} ticket(s) for ${selectedShow.title}.`);

    } else {
      setMessage(`❌ Booking failed. Not enough ${selectedCategory} seats available.`);
    }
  };

  const handleCancelBooking = (bookingToCancel) => {
    // Find the show associated with the canceled booking
    const showToUpdate = shows.find(s => s.id === bookingToCancel.showId);
    
    // Create a new updated show object with the seats returned
    const updatedShow = {
      ...showToUpdate,
      availableSeats: {
        ...showToUpdate.availableSeats,
        [bookingToCancel.category]: showToUpdate.availableSeats[bookingToCancel.category] + bookingToCancel.seats,
      },
    };
    
    // Find the index of the show in our array
    const showIndex = shows.findIndex(s => s.id === bookingToCancel.showId);
    
    // Create a NEW array of shows and update the specific show
    const updatedShows = [...shows];
    updatedShows[showIndex] = updatedShow;
    setShows(updatedShows);

    // Update the selectedShow state if it was the one being displayed
    if (selectedShow.id === bookingToCancel.showId) {
      setSelectedShow(updatedShow);
    }
    
    // Filter out the booking from the history (create a NEW array)
    const updatedHistory = bookingHistory.filter(booking => booking.id !== bookingToCancel.id);
    setBookingHistory(updatedHistory);
    
    setMessage(`✅ Canceled booking ID: ${bookingToCancel.id}.`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* Container for the main movie info card */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl text-center mb-6">
        {/* NEW: Show Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="show-select" className="text-gray-700 font-semibold">
            Select a Movie:
          </label>
          <select 
            id="show-select"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            onChange={(e) => setSelectedShow(shows.find(s => s.id === e.target.value))}
            value={selectedShow.id}
          >
            {shows.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.theater})
              </option>
            ))}
          </select>
        </div>
        
        {/* We now use selectedShow to display the info */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedShow.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{selectedShow.theater}</p>
        
        <p className="text-gray-500">{formatDate(selectedShow.time)}</p>
        <p className="text-gray-500">Duration: {selectedShow.duration} mins</p>
        <p className="text-gray-500 mb-6">Genre: {selectedShow.genre}</p>
        
        <div className="flex justify-around items-center bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-md text-gray-700 font-semibold">
            Regular Seats: <span className="text-lg text-green-600 font-bold">{selectedShow.availableSeats.regular}</span>
          </p>
          <p className="text-md text-gray-700 font-semibold">
            Premium Seats: <span className="text-lg text-green-600 font-bold">{selectedShow.availableSeats.premium}</span>
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
        {bookingHistory.length === 0 ? (
          <p className="text-center text-gray-500">You have no bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookingHistory.map((booking) => (
              <li key={booking.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800">
                    {booking.seats} {booking.category} seat{booking.seats > 1 ? 's' : ''} for {booking.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Time:</span> {formatDate(booking.time)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Booking ID:</span> {booking.id}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className={`font-bold ${booking.category === 'premium' ? 'text-indigo-600' : 'text-gray-600'}`}>
                    ${booking.category === 'regular' ? booking.seats * 15 : booking.seats * 25}
                  </p>
                  <button 
                    onClick={() => handleCancelBooking(booking)}
                    className="py-1 px-3 ml-4 text-sm font-semibold text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default App;
