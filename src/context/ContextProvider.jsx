import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../costants";

export const Context = createContext();
export const useContextProvider = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataRequest, setDataRequest] = useState([]);
  const [dashboardTotalBid, setDashboardTotalBid] = useState(0);
  const [selectedDate, setSelectDate] = useState("");
  const [dashboardWinningUsers, setDashboardWinningUsers] = useState(0);

  const allbids = async () => {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/all-bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { date: selectedDate || undefined },
      });
      setDataRequest(data);
      const totalbids = (data || []).reduce(
        (sum, item) => sum + (Number(item.total_bid) || 0),
        0
      );
      setDashboardTotalBid(totalbids);
    } catch (error) {
      console.error("Failed to fetch all bids:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    allbids();
  }, [selectedDate]);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        dataRequest,
        dashboardTotalBid,
        setDataRequest,
        setSelectDate,
        dashboardWinningUsers
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
