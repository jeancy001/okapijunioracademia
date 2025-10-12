import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './app/HomePage'
import NavPage from './app/NavPage'

function App() {

  return (
  <div>
    <NavPage/>
    <Routes>
       <Route path='/' element={<HomePage/>} />
    </Routes>
   </div>
  )
}

export default App
