import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FavoritesEvent from "../components/favorites/FavoritesEvent";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import CreateEvent from "../components/create_event/createEvent";
import ListEvents from "../components/list_events/ListEvents";
import AdminDashboard from "../components/admin/AdminDashboard";
import ManageEvents from "../components/manage_events/ManageEvents";
import UserProfile from "../components/profile/UserProfile";
import HomePage from "../components/HomePage";
import AdminRegister from "../components/admin/AdminRegister";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/favorites" element={<FavoritesEvent />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/create-event" element={<CreateEvent />}></Route>
            <Route path="/events" element={<ListEvents />}></Route>
            <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
            <Route path="/manage-events" element={<ManageEvents />}></Route>
            <Route path="/profile" element={<UserProfile />}></Route>
            <Route path="/admin-register" element={<AdminRegister />}></Route>
        </Routes>
    );
}

export default AppRoutes;