import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../costants";
import { usePagination } from "../hooks/usePagination";
import moment from "moment-timezone";
import dayjs from "dayjs";

export const Context = createContext();
export const useContextProvider = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedDateAB, setSelectedDateAB] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [abData, setAbData] = useState([]);
  const [abDataShowNo, setAbDataShowNo] = useState("");
  const [requests, setRequests] = useState([]);
  const [dashboardTotalBid, setDashboardTotalBid] = useState(0);
  const [lastGameTotalBid, setLastGameTotalBid] = useState({
    amount: 0,
    timestamp: null,
  });
  const [lastGameWinners, setLastGameWinners] = useState({
    winners: [],
    count: 0,
    timestamp: null,
  });
  const [selectedDate, setSelectDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedDateWinningUsers, setSelectedDateWinningUsers] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [latestLastGameResult, setLatestLastGameResult] = useState("");
  const [dashboardWinningUsers, setDashboardWinningUsers] = useState(0);
  const [games, setGames] = useState([]);
  const [gamesDate, setGamesDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [existingGames, setExistingGames] = useState([]);
  const [fetchAllCount, setFetchAllCount] = useState(0);
  const [gamesTotal, setGamesTotal] = useState(0);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();

  // Helper function to check authentication
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const triggerDataFetch = () => {
    setIsAuthenticated(true);
    fetchAllData();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // all bids api  ----------------------
  const allbids = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/all-bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { date: selectedDate },
      });
      setDataRequest(data);

      // Calculate total bids
      const totalbids = (data || []).reduce(
        (sum, item) => sum + (Number(item.total_bid) || 0),
        0
      );
      setDashboardTotalBid(totalbids);

      // Find the last game's total bid based on date/time
      if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        );

        const lastBid = sortedData[0];
        if (lastBid) {
          setLastGameTotalBid({
            amount: Number(lastBid.total_bid || 0),
            timestamp: lastBid.createdAt,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch all bids:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  //  winning users api ---------------------
  const lastWinner = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const {
        data: {
          data: { data },
        },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/last-winner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { limit, page, date: selectedDateWinningUsers },
      });

      const jantriData = (data || [])?.map((item) => {
        const finalBidNumber = item.Game.finalBidNumber.toString();
        const firstDigit = finalBidNumber[0];
        const secondDigit = finalBidNumber[1];

        const bidNumbers = JSON.parse(item.bidNumbers || "[]");
        const insideNumbers = JSON.parse(item.insideNumbers || "[]");
        const outsideNumbers = JSON.parse(item.outsideNumbers || "[]");

        const matchedNumbers = [];

        bidNumbers.forEach((bid) => {
          if (bid.number.toString() === finalBidNumber) {
            matchedNumbers.push(`${bid.number}J`);
          }
        });

        insideNumbers.forEach((inside) => {
          if (inside.number.toString() === firstDigit) {
            matchedNumbers.push(`${inside.number}A`);
          }
        });

        outsideNumbers.forEach((outside) => {
          if (outside.number.toString() === secondDigit.toString()) {
            matchedNumbers.push(`${outside.number}B`);
          }
        });
        return {
          ...item,
          matchedNumbers,
        };
      });

      const combinedData = [...jantriData];
      setRequests(combinedData);
      changeTotal(combinedData?.length || 0);
      setDashboardWinningUsers(combinedData?.length || 0);

      if (combinedData.length > 0) {
        const sortedData = [...combinedData].sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        );

        const latestTimestamp = sortedData[0]?.createdAt;
        const latestWinners = sortedData.filter((winner) =>
          moment(winner.createdAt).isSame(moment(latestTimestamp))
        );

        setLastGameWinners({
          winners: latestWinners,
          count:latestWinners.length,
          timestamp: latestTimestamp,
        });
      }
    } catch (error) {
      console.error("Failed to fetch winners:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  // andar bahar winners  -------------------------
  const abWinner = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/ander-bahar-winner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { page, limit, date: selectedDateAB },
      });

      setAbData(data);
      setAbDataShowNo(data?.length || 0);
    } catch (error) {
      console.error("Failed to fetch ander bahar winners:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  // Games API call
  const fetchGames = async () => {
    // console.log('API')
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/web/retrieve/games`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": true,
        },
        params: {
          page,
          limit,
          startDateTime: gamesDate,
        },
      });

      const gamesData = response.data.data.games?.map((game) => ({
        id: game.id,
        name: game.name,
        startDateTime: moment(game.startDateTime)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        endDateTime: moment(game.endDateTime)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        resultDateTime: moment(game.resultDateTime)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        image: game.image,
        status: game.status,
        finalBidNumber: game.finalBidNumber,
      }));

      for (const gameData of gamesData) {
        if (gameData.finalBidNumber) {
          if(gamesDate == dayjs().format("YYYY-MM-DD"))
          setLatestLastGameResult(gameData);
          break;
        }
      }
      
      setGames(gamesData);
      setGamesTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching games:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await Promise.all([allbids(), lastWinner(), abWinner(), fetchGames()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [
    page,
    limit,
    selectedDateAB,
    selectedDateWinningUsers,
    selectedDate,
    gamesDate,
    
  ]);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        dataRequest,
        dashboardTotalBid,
        lastGameTotalBid,
        setDataRequest,
        setSelectDate,
        selectedDate,
        dashboardWinningUsers,
        setSelectedDateWinningUsers,
        selectedDateWinningUsers,
        setRequests,
        requests,
        abData,
        setSelectedDateAB,
        selectedDateAB,
        abDataShowNo,
        latestLastGameResult,
        setLatestLastGameResult,
        games,
        gamesTotal,
        setGamesDate,
        gamesDate,
        lastGameWinners,
        setLastGameWinners,
        existingGames,
        setExistingGames,
        error,
        setError,
        fetchAllCount,
        triggerDataFetch,
        isAuthenticated,
        fetchGames,
        setGames,
        setGamesTotal,
        setIsAuthenticated,
        // setLatestLastGameResult
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
