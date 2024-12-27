import React, { useState } from 'react';
import RoomDetailsModal from "./RoomDetailsModal";

const BookingModal = ({ isOpen, onClose, rooms, onBookSuccess }) => {
    const [clientFullName, setClientFullName] = useState('');
    const [date, setDate] = useState('');
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [error, setError] = useState('');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null)
    const API_BASE_URL = 'http://localhost:9090';

    const handleOpenDetailsModal = (room) => {
        setSelectedRoomDetails(room);
        setIsDetailsModalOpen(true);
    };
    const handleCloseDetailsModal = () => {
        setSelectedRoomDetails(null);
        setIsDetailsModalOpen(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!clientFullName || !date || !heureDebut || !heureFin || !selectedRoom) {
            setError('Tous les champs sont obligatoires.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/room/${selectedRoom}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    clientFullName,
                    date,
                    heureDebut,
                    heureFin
                })
            });

            if (response.ok) {
                alert('Réservation réussie!');
                onBookSuccess();
                onClose();
            } else {
                const errorData = await response.text();
                setError(errorData || 'Erreur inconnue lors de la réservation.');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la réservation');
            console.error(err);
        }
    };
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'clientFullName':
                setClientFullName(value);
                break;
            case 'bookingDate':
                setDate(value);
                break;
            case 'bookingStartTime':
                setHeureDebut(value);
                break;
            case 'bookingEndTime':
                setHeureFin(value);
                break;
            case 'selectRoom':
                setSelectedRoom(value);
                break;
            default:
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                <h2>Réserver une salle</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="selectRoom">Salle:</label>
                    <select
                        id="selectRoom"
                        value={selectedRoom}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Sélectionner une salle</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.roomType}
                            </option>
                        ))}
                    </select>
                    {selectedRoom && rooms.find(room => room.id === Number(selectedRoom))  && (
                        <button type="button" onClick={()=>handleOpenDetailsModal(rooms.find(room => room.id === Number(selectedRoom)))}>Voir Détails</button>
                    )}
                    <input
                        type="text"
                        id="clientFullName"
                        placeholder="Nom complet du client"
                        required
                        value={clientFullName}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="bookingDate">Date</label>
                    <input
                        type="date"
                        id="bookingDate"
                        required
                        value={date}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="bookingStartTime">Heure Début:</label>
                    <input
                        type="time"
                        id="bookingStartTime"
                        required
                        value={heureDebut}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="bookingEndTime">Heure Fin:</label>
                    <input
                        type="time"
                        id="bookingEndTime"
                        required
                        value={heureFin}
                        onChange={handleInputChange}
                    />
                    <br />
                    <button type="submit">Confirmer Réservation</button>
                    <RoomDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} room={selectedRoomDetails}/>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;