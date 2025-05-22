import ContextProvider from './context/ContextProvider'
import Routing from './routes/Routing'

const App = () => {
  return (
    <ContextProvider>
    <Routing/>
    </ContextProvider>
  )
}

export default App
