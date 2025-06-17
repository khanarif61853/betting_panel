import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../costants";
import { usePagination } from "../hooks/usePagination";
import moment from 'moment-timezone';
import dayjs from 'dayjs';

export const Context = createContext();
export const useContextProvider = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedDateAB, setSelectedDateAB] = useState("");
  const [abData, setAbData] = useState([]);
  const [abDataShowNo, setAbDataShowNo] = useState("");
  const [requests, setRequests] = useState([]);
  const [dashboardTotalBid, setDashboardTotalBid] = useState(0);
  const [lastGameTotalBid, setLastGameTotalBid] = useState({ amount: 0, timestamp: null });
  const [lastGameWinners, setLastGameWinners] = useState({ winners: [], count: 0, timestamp: null });
  const [selectedDate, setSelectDate] = useState("");
  const [selectedDateWinningUsers, setSelectedDateWinningUsers] = useState("");
  const [latestLastGameResult, setLatestLastGameResult] = useState("");
  const [dashboardWinningUsers, setDashboardWinningUsers] = useState(0);
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [gamesDate, setGamesDate] = useState(dayjs());
  const [gamesTotal, setGamesTotal] = useState(0);
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
        // Sort by createdAt to get the latest bid
        const sortedData = [...data].sort((a, b) => 
          moment(b.createdAt).diff(moment(a.createdAt))
        );
        
        const lastBid = sortedData[0];
        if (lastBid) {
          setLastGameTotalBid({
            amount: Number(lastBid.total_bid || 0),
            timestamp: lastBid.createdAt
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch all bids:", error);
    }
    setLoading(false);
  };

  //  winning users api ---------------------

  const lastWinner = async () => {
    setLoading(true);
    try {
      const {
        data: { data:{data} },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/last-winner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { limit, page, date: selectedDateWinningUsers },
      });
      // console.log({data})
      const jantriData = (data || [])?.map((item) => {
const finalBidNumber = item.Game.finalBidNumber.toString(); // convert to string
const firstDigit = finalBidNumber[0];
const secondDigit = finalBidNumber[1];

// Parse the JSON strings
const bidNumbers = JSON.parse(item.bidNumbers || '[]');
const insideNumbers = JSON.parse(item.insideNumbers || '[]');
const outsideNumbers = JSON.parse(item.outsideNumbers || '[]');

const matchedNumbers = [];

// Match in bidNumbers
bidNumbers.forEach((bid) => {
  if (bid.number.toString() === finalBidNumber) {
    matchedNumbers.push(`${bid.number}J`);
  }
});

// Match in insideNumbers
insideNumbers.forEach((inside) => {
  if (inside.number.toString() === firstDigit) {
    matchedNumbers.push(`${inside.number}A`);
  }
});

// Match in outsideNumbers
outsideNumbers.forEach((outside) => {
  if (outside.number.toString() === secondDigit.toString()) {
    matchedNumbers.push(`${outside.number}B`);
  }
});
        return({
        ...item,
        matchedNumbers
        // bidNumber: arr.push()
        // remark: "Jantri",
      })});

      // const crossData = (data.cross || []).map((item) => ({
      //   ...item,
      //   remark: "Cross",
      // }));

      // const openPlayData = (data.openPlay || []).map((item) => ({
      //   ...item,
      //   remark: "Open Play",
      // }));

      const combinedData = [...jantriData];
      // console.log({combinedData})
      setRequests(combinedData);
      changeTotal(combinedData?.length || 0);
      setDashboardWinningUsers(combinedData?.length || 0);

      // Find the latest winners based on timestamp
      if (combinedData.length > 0) {
        const sortedData = [...combinedData].sort((a, b) => 
          moment(b.createdAt).diff(moment(a.createdAt))
        );
        
        // Get the most recent timestamp
        const latestTimestamp = sortedData[0]?.createdAt;
        
        // Filter winners from the same latest game
        const latestWinners = sortedData.filter(winner => 
          moment(winner.createdAt).isSame(moment(latestTimestamp))
        );
// console.log(latestWinners,'lastWinner-')
        setLastGameWinners({
          winners: latestWinners,
          count: latestWinners.length,
          timestamp: latestTimestamp
        });
      }
    } catch (error) {
      console.error("Failed to fetch winners:", error);
    }
    setLoading(false);
  };

  // andar bahar winners  -------------------------
  const abWinner = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  // Games API call
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/web/retrieve/games`, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'ngrok-skip-browser-warning': true,
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
        startDateTime: moment(game.startDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
        endDateTime: moment(game.endDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
        resultDateTime: moment(game.resultDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
        image: game.image,
        status: game.status,
        finalBidNumber: game.finalBidNumber,
      }));
      console.log(gamesData,'gam,e')
      for (const gameData of gamesData) {
        if (gameData.finalBidNumber) {
          setLatestLastGameResult(gameData)
          break;
        }
      }
      // Get current Indian time
      // const currentIndianTime = moment().tz('Asia/Kolkata');

      // // Find latest declared result
      // const declaredGames = gamesData.filter(game => {
      //   const resultTime = moment(game.resultDateTime);
      //   return game.finalBidNumber && resultTime.isBefore(currentIndianTime);
      // });

      // if (declaredGames.length > 0) {
      //   // Sort by result datetime to get the latest
      //   const latestDeclared = declaredGames.sort((a, b) => 
      //     moment(b.resultDateTime).diff(moment(a.resultDateTime))
      //   )[0];
      //   setLatestLastGameResult(latestDeclared.finalBidNumber);
      // }


      setGames(gamesData);
      setGamesTotal(response.data.data.total);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
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
    fetchAllData();
  }, [page, limit, selectedDateAB, selectedDateWinningUsers, selectedDate, gamesDate]);

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
        dashboardWinningUsers,
        setSelectedDateWinningUsers,
        selectedDateWinningUsers,
        setRequests,
        requests,
        abData,
        setSelectedDateAB,
        abDataShowNo,
        latestLastGameResult,
        setLatestLastGameResult,
        games,
        gamesTotal,
        setGamesDate,
        gamesDate,
        lastGameWinners,
        setLastGameWinners,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
