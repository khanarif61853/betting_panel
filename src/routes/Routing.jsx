import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicRoute } from '../helpers/PublicRoute'
import { ProtectedRoute } from '../helpers/ProtectedRoute'
import { SignIn, PageNotFound } from '../pages'; // Adjust the path if needed
import Home from '../pages/Home';
import Header from '../component/Header';
import Games from '../pages/Games';
import Game from '../pages/Game';
import Profile from '../pages/Profile';
import QrCodes from '../pages/QrCodes';
import WithdrawalRequests from '../pages/WithdrawalRequests';
import Customers from '../pages/Customers';
import Rules from "../pages/Rules.jsx";
import VerifyPayment from "../pages/VerifyPayment.jsx";


const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute />}>
                <Route path="/" element={<Navigate replace to="/sign-in" />} />
                <Route path="/sign-in" element={<SignIn />} />

            </Route>
            <Route path="/" element={<ProtectedRoute />}>
                <Route element={<Header />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/withdrawal-requests" element={<WithdrawalRequests />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/Rules" element={<Rules />} />
                    <Route path="/qr-code" element={<QrCodes />} />
                    <Route path="/verify-payments" element={<VerifyPayment />} />
                    <Route path="*" element={<PageNotFound />} >
                    </Route>
                </Route>

            </Route>
        </Routes>
    )
}

export default Routing
