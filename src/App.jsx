import { LocalizationProvider } from "@mui/x-date-pickers";
import ContextProvider from "./context/ContextProvider";
import Routing from "./routes/Routing";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

const App = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {  
      if (error.response && error.response.status === 401) {
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    }
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ContextProvider>
        <Routing />
      </ContextProvider>
    </LocalizationProvider>
  );
};

export default App;
