import React from "react";
import { Routes, Route } from "react-router-dom";

import FavoritesEvent from "../components/favorites/FavoritesEvent";
import OtherEvents from "../components/other_events/OtherEvents";
// import Login from "../pages/login/Login";
import Login from "../components/login/Login";
import Hero from "../components/Hero/Hero";
import EventCreationForm from "../components/event_creation/EventCreationForm";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<><Hero /> <OtherEvents /> </>}></Route>
            <Route path="/favorites" element={<FavoritesEvent />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/event_creation" element={<EventCreationForm />}></Route>
        </Routes>
    );
}

export default AppRoutes;