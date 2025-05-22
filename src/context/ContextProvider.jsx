import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../costants";
import { usePagination } from "../hooks/usePagination";

export const Context = createContext();
export const useContextProvider = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataRequest, setDataRequest] = useState([]);
  const [requests, setRequests] = useState([]);
  const [dashboardTotalBid, setDashboardTotalBid] = useState(0);
  const [selectedDate, setSelectDate] = useState("");
  const [selectedDateWinningUsers, setSelectedDateWinningUsers] = useState("");
  const [dashboardWinningUsers, setDashboardWinningUsers] = useState(0);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();
  // all bids api  ----------------------
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

  //  winning users api ---------------------

  const lastWinner = async () => {
    setLoading(true);
    const {
      data: { data },
    } = await axios.get(`${BASE_URL}/api/web/retrieve/last-winner`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { limit, page, date: selectedDateWinningUsers || undefined },
    });
    console.log("lastWinner", data);
    const jantriData = (data.jantri || []).map((item) => ({
      ...item,
      remark: "Jantri",
    }));

    const crossData = (data.cross || []).map((item) => ({
      ...item,
      remark: "Cross",
    }));

    const openPlayData = (data.openPlay || []).map((item) => ({
      ...item,
      remark: "Open Play",
    }));

    const combinedData = [...jantriData, ...crossData, ...openPlayData];
    setRequests(combinedData);
    changeTotal(combinedData?.length || 0);
    setDashboardWinningUsers(combinedData?.length || 0);

    setLoading(false); // Data is loaded, set loading to false
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([allbids(), lastWinner()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [page, limit, selectedDate, selectedDateWinningUsers]);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        dataRequest,
        dashboardTotalBid,
        setDataRequest,
        setSelectDate,
        dashboardWinningUsers,
        setSelectedDateWinningUsers,
        selectedDateWinningUsers,
        setRequests,
        requests,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
