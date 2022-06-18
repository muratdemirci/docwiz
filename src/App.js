import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import HowItWorks from './contents/HowItWorks'
import QuickStart from './contents/QuickStart'
import NotFoundPage from './contents/NotFoundPage'

import { GeistProvider, CssBaseline } from '@geist-ui/react'

function App() {
  return (
    <GeistProvider>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<HowItWorks />} />
            <Route exact path="/quick-start" element={<QuickStart />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </GeistProvider>
  )
}

export default App
