import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "../helpers/PublicRoute";
import { ProtectedRoute } from "../helpers/ProtectedRoute";
import { SignIn, PageNotFound } from "../pages"; // Adjust the path if needed
import Home from "../pages/Home";
import Header from "../component/Header";
import Games from "../pages/Games";
import Game from "../pages/Game";
import Profile from "../pages/Profile";
import QrCodes from "../pages/QrCodes";
import WithdrawalRequests from "../pages/WithdrawalRequests";
import Customers from "../pages/Customers";
import Rules from "../pages/Rules.jsx";
import AddMoney from "../pages/AddMoney.jsx";
import WinningUsers from "../pages/WinningUsers.jsx";
import TotalBid from "../pages/TotalBid.jsx";
import FinalJantri from "../pages/FinalJantri.jsx";
import AndarBaharWinner from "../pages/AndarBaharWinner.jsx";
import WithdrawalApprovedList from "../pages/WithdrawalApprovedList.jsx";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route path="/" element={<Navigate replace to="/sign-in" />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Route>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="*" element={<PageNotFound />} />
          <Route element={<Header />}>
            <Route path="/home" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game" element={<Game />} />
            <Route path="/final-jantri" element={<FinalJantri />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/andar-bahar-winner" element={<AndarBaharWinner />} />
            <Route path="/withdrawal-approved" element={<WithdrawalApprovedList />} />
            <Route
              path="/withdrawal-requests"
              element={<WithdrawalRequests />}
            />
            <Route path="/add-money" element={<AddMoney />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/Rules" element={<Rules />} />
            <Route path="/qr-code" element={<QrCodes />} />
            {/* dashboard cards routes ------------------ */}
            <Route path="/winning-users" element={<WinningUsers />} />
            <Route path="/totalbid" element={<TotalBid />} />
          </Route>
        </Route>
      </Routes>
      {/* <Route path="/verify-payments" element={<VerifyPayment />} /> */}
    </>
  );
};

export default Routing;
