import { useState } from 'react'
import './App.css'
import  Upload  from './pages/upload'
import Dashboard from './pages/dashboard'
import Store from './pages/store'
import { BackgroundRippleEffect } from './components/ui/background-ripple-effect'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <h1 className='text-green-600 text-5xl font-extrabold'>SharePoint</h1>
       {/* <BackgroundRippleEffect/> */}
       <Store/>
        {/* <Dashboard/> */}
        <Upload/>
      </div>
  )
}

export default App

