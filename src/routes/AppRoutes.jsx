import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FavoritesEvent from "../components/favorites/FavoritesEvent";
import OtherEvents from "../components/other_events/OtherEvents";
import Login from "../components/login/Login";
import Hero from "../components/Hero/Hero";
import CreateEvent from "../components/create_event/createEvent";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<><Hero /> <OtherEvents /> </>}></Route>
            <Route path="/favorites" element={<FavoritesEvent />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/create-event" element={<CreateEvent />}></Route>
        </Routes>
    )
}

export default AppRoutes;