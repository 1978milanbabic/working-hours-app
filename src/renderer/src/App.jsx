import { HashRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/userContext'
import RoutesWrapper from './RoutesWrapper'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <RoutesWrapper />
      </Router>
    </UserProvider>
  )
}

export default App
