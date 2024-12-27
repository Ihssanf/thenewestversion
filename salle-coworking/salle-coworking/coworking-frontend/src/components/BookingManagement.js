import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state
    const navigate = useNavigate();

    // Fetch bookings
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('jwt'); // Retrieve the JWT from localStorage
            if (!token) {
                console.error('No token found, please log in.');
                setError('No token found, please log in.');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:9090/bookings/all-bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                setError('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('An error occurred while fetching bookings');
        } finally {
            setLoading(false); // Stop loading after request completes
        }
    };

    const handleDelete = async (bookingId) => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.error('No token found, please log in.');
                setError('No token found, please log in.');
                return;
            }

            const response = await fetch(`http://localhost:9090/bookings/booking/${bookingId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove the deleted booking from the state without refetching the entire list
                setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
            } else {
                setError('Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            setError('An error occurred while deleting the booking');
        }
    };

    const handleEdit = (booking) => {
        navigate(`/edit-booking/${booking.id}`);  // Navigate to the edit page
    };

    return (
        <div className="container mt-4">
            <h2>Booking Management</h2>

            {loading && <div>Loading bookings...</div>} {/* Show loading message */}

            {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}

            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Room Type</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.roomType}</td>
                            <td>{booking.date}</td>
                            <td>{booking.startTime}</td>
                            <td>{booking.endTime}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEdit(booking)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(booking.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No bookings found</td>
                    </tr>
                )}
                </tbody>
            </table>

            <Link to="/admin" className="btn btn-secondary mt-3">Back to Admin Panel</Link>
        </div>
    );
};

export default BookingManagement;
