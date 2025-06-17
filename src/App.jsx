import { LocalizationProvider } from '@mui/x-date-pickers'
import ContextProvider from './context/ContextProvider'
import Routing from './routes/Routing'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ContextProvider>
    <Routing/>
    </ContextProvider>
    </LocalizationProvider>
  )
}

export default App
