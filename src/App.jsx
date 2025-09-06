import React, { useState } from 'react';

const App = () => {
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
    }
  ]);

  const [selectedShow, setSelectedShow] = useState(null);
  const [page, setPage] = useState('home'); // NEW: State to manage the current page

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
    if (selectedShow.availableSeats[selectedCategory] >= seatsToBook) {
      const showIndex = shows.findIndex(s => s.id === selectedShow.id);
      
      const updatedShow = {
        ...selectedShow,
        availableSeats: {
          ...selectedShow.availableSeats,
          [selectedCategory]: selectedShow.availableSeats[selectedCategory] - seatsToBook,
        },
      };
      
      const updatedShows = [...shows];
      updatedShows[showIndex] = updatedShow;
      setShows(updatedShows);
      
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
    const showToUpdate = shows.find(s => s.id === bookingToCancel.showId);
    
    const updatedShow = {
      ...showToUpdate,
      availableSeats: {
        ...showToUpdate.availableSeats,
        [bookingToCancel.category]: showToUpdate.availableSeats[bookingToCancel.category] + bookingToCancel.seats,
      },
    };
    
    const showIndex = shows.findIndex(s => s.id === bookingToCancel.showId);
    
    const updatedShows = [...shows];
    updatedShows[showIndex] = updatedShow;
    setShows(updatedShows);

    if (selectedShow && selectedShow.id === bookingToCancel.showId) {
      setSelectedShow(updatedShow);
    }
    
    const updatedHistory = bookingHistory.filter(booking => booking.id !== bookingToCancel.id);
    setBookingHistory(updatedHistory);
    
    setMessage(`✅ Canceled booking ID: ${bookingToCancel.id}.`);
  };

  const renderHomePage = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Shows</h2>
        <ul className="space-y-4">
          {shows.map(show => (
            <li key={show.id} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center shadow-sm">
              <div className="text-left w-full sm:w-2/3">
                <p className="text-xl font-semibold text-gray-800">{show.title}</p>
                <p className="text-sm text-gray-500">{show.theater} - {formatDate(show.time)}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Seats Left:</span> {show.availableSeats.regular + show.availableSeats.premium}
                </p>
              </div>
              <button 
                onClick={() => {
                  setSelectedShow(show);
                  setPage('booking');
                }}
                className="mt-4 sm:mt-0 w-full sm:w-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition duration-200 ease-in-out"
              >
                Book Now
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBookingPage = () => {
    return (
      <>
        {/* We use a div to go back to the home page */}
        <div className="w-full max-w-2xl mb-4">
          <button 
            onClick={() => setPage('home')}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            ← Back to All Shows
          </button>
        </div>
        
        {/* Existing Movie Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl text-center mb-6">
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
        
        {/* Existing Booking Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Book Your Tickets</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
          
          <button 
            onClick={handleBookTickets} 
            className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Book Now
          </button>

          {message && (
            <p className={`mt-4 text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
        
        {/* Existing Booking History Section */}
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
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Conditional rendering based on the 'page' state */}
      {page === 'home' ? renderHomePage() : renderBookingPage()}
    </div>
  );
};

export default App;
