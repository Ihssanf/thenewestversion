import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import RoomManagement from "./admin/RoomManagement";
import "./admin/Admin.css" // Corrected import path

const Admin = () => {
    return (
        <section
            className="container mt-5"
            style={{ backgroundColor: "#f5f5dc", minHeight: "100vh", padding: "2rem 1rem" , fontFamily: 'Arial, sans-serif' }}
        >
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow-lg rounded-4 border-light admin-card">
                        <div className="card-body p-5">
                            {/* Title with subtle decorative line */}
                            <div className="text-center mb-5">
                                <h2 className="card-title text-dark font-weight-bold display-4 admin-title">
                                    Welcome, Administrator!
                                </h2>
                                <div className="admin-title-line"></div>
                                <p className="text-secondary mt-3 fs-5 admin-subtitle">
                                    Manage rooms and bookings efficiently. This is your central hub for all administrative tasks.
                                </p>

                            </div>
                            <hr className="my-4"/>

                            {/* Button Section */}
                            <div className="d-grid gap-4">
                                <Link
                                    to="/admin/rooms"
                                    className="btn admin-button d-flex align-items-center justify-content-center"

                                >
                                    <i className="bi bi-house-door me-3"></i>
                                    Room Management
                                </Link>
                                <Link
                                    to="/bookings"
                                    className="btn admin-button d-flex align-items-center justify-content-center"
                                >
                                    <i className="bi bi-calendar-check me-3"></i>
                                    Booking Management
                                </Link>

                            </div>

                            {/* Routes */}
                            <Routes>
                                <Route path="/rooms" element={<RoomManagement/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Admin;