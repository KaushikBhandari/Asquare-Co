import React, { createContext, useContext, useState } from 'react';
import { saveBooking, updateBookingStatus } from '../firebase/config';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [localBookings, setLocalBookings] = useState([]);

  const addBooking = async (booking) => {
    const bookingData = {
      ...booking,
      bookingId: 'WL' + Date.now(),
      status: 'confirmed',
    };
    // Try Firebase first, fallback to local
    const { id, error } = await saveBooking(bookingData);
    const finalBooking = { ...bookingData, id: id || bookingData.bookingId };
    setLocalBookings(prev => [finalBooking, ...prev]);
    if (error) console.warn('Firebase save failed, using local:', error);
    toast.success('Booking Confirmed! 🎉');
    return finalBooking;
  };

  const cancelBooking = async (id) => {
    await updateBookingStatus(id, 'cancelled');
    setLocalBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    toast.success('Booking cancelled.');
  };

  return (
    <BookingContext.Provider value={{ localBookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
