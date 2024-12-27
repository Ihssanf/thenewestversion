import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:9090";

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addFormData, setAddFormData] = useState({
        roomType: '',
        pricePerHour: '',
        photo: null,
    });
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        roomType: '',
        pricePerHour: '',
        photo: null,
        photoUrl: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/all-rooms`);
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
                console.log("Rooms fetched successfully:", data);
            } else {
                console.error("Failed to fetch rooms");
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleAddRoomClick = () => {
        setEditingRoomId(null);  // Clear any editing state when adding a new room
        setShowAddForm(true);
        setAddFormData({
            roomType: '',
            pricePerHour: '',
            photo: null,
        });
    };

    const handleEditRoomClick = (room) => {
        setEditingRoomId(room.id);
        setEditFormData({
            roomType: room.roomType,
            pricePerHour: room.pricePerHour,
            photo: null,
            photoUrl: room.photo,  // Store photo URL to show in the form
        });
    };

    const handleInputChange = (e, setter) => {
        const { name, value, type, files } = e.target;
        setter(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleAddRoomSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('roomType', addFormData.roomType);
        formData.append('pricePerHour', addFormData.pricePerHour);
        if (addFormData.photo) {
            formData.append('photo', addFormData.photo);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/rooms/add/new-room`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchRooms();
                setShowAddForm(false);
                setAddFormData({
                    roomType: '',
                    pricePerHour: '',
                    photo: null,
                });
            } else {
                console.error('Failed to add room', response);
            }
        } catch (error) {
            console.error('Error during room creation:', error);
        }
    };

    const handleUpdateRoomSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (editFormData.roomType) {
            formData.append('roomType', editFormData.roomType);
        }
        if (editFormData.pricePerHour) {
            formData.append('pricePerHour', editFormData.pricePerHour);
        }
        if (editFormData.photo) {
            formData.append('photo', editFormData.photo);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/rooms/update/${editingRoomId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: formData,
            });

            if (response.ok) {
                fetchRooms();
                setEditingRoomId(null);
                setEditFormData({
                    roomType: '',
                    pricePerHour: '',
                    photo: null,
                    photoUrl: null,
                });
            } else {
                console.error("Failed to update room.", response);
            }
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/delete/room/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                fetchRooms();
            } else {
                console.error("Failed to delete room.", response);
            }
        } catch (error) {
            console.error("Error during room deletion:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Room Management</h2>
            <button className="btn btn-primary mb-3" onClick={handleAddRoomClick}>Add New Room</button>
            {showAddForm && (
                <form onSubmit={handleAddRoomSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <input
                            type="text"
                            name="roomType"
                            className="form-control"
                            value={addFormData.roomType}
                            onChange={(e) => handleInputChange(e, setAddFormData)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price Per Hour</label>
                        <input
                            type="number"
                            name="pricePerHour"
                            className="form-control"
                            value={addFormData.pricePerHour}
                            onChange={(e) => handleInputChange(e, setAddFormData)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Photo</label>
                        <input
                            type="file"
                            name="photo"
                            className="form-control"
                            onChange={(e) => handleInputChange(e, setAddFormData)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success">Add Room</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                        Cancel
                    </button>
                </form>
            )}

            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Photo</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rooms.map(room => (
                    <tr key={room.id}>
                        <td>{room.id}</td>
                        <td>{room.roomType}</td>
                        <td>{room.pricePerHour}</td>
                        <td>
                            {room.photo && <img src={`data:image/png;base64,${room.photo}`} alt="Room" style={{ maxWidth: '50px', maxHeight: '50px' }} />}
                        </td>
                        <td>
                            {editingRoomId === room.id ? (
                                <form onSubmit={handleUpdateRoomSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Room Type</label>
                                        <input
                                            type="text"
                                            name="roomType"
                                            className="form-control"
                                            value={editFormData.roomType}
                                            onChange={(e) => handleInputChange(e, setEditFormData)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Price Per Hour</label>
                                        <input
                                            type="number"
                                            name="pricePerHour"
                                            className="form-control"
                                            value={editFormData.pricePerHour}
                                            onChange={(e) => handleInputChange(e, setEditFormData)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Photo</label>
                                        {editFormData.photoUrl && (
                                            <img src={`data:image/png;base64,${editFormData.photoUrl}`} alt="Room" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        )}
                                        <input
                                            type="file"
                                            name="photo"
                                            className="form-control"
                                            onChange={(e) => handleInputChange(e, setEditFormData)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">Update</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditingRoomId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <button className="btn btn-sm btn-warning" onClick={() => handleEditRoomClick(room)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Link to={"/admin"} className="btn btn-secondary mt-3">Back to Admin Panel</Link>
        </div>
    );
};

export default RoomManagement;
