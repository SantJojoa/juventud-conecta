import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FavoritesEvent from "../components/favorites/FavoritesEvent";
import OtherEvents from "../components/other_events/OtherEvents";
import Login from "../components/login/Login";
import Hero from "../components/Hero/Hero";
import CreateEvent from "../components/create_event/createEvent";
import ListEvents from "../components/list_events/ListEvents";
import AdminDashboard from "../components/admin/AdminDashboard";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<><Hero /> <OtherEvents /> </>}></Route>
            <Route path="/favorites" element={<FavoritesEvent />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/create-event" element={<CreateEvent />}></Route>
            <Route path="/events" element={<ListEvents />}></Route>
            <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
        </Routes>
    );
}

export default AppRoutes;