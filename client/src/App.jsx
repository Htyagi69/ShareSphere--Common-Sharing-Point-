import { useState } from 'react'
import './App.css'
import  Upload  from './pages/upload'
import Pouchdb from './pages/pouchdb'
import OfflineStore from './pages/OfflineStore'
function App() {
  return (
      <div>
        <h1 className='text-green-600 text-5xl font-extrabold'>SharePoint</h1>
        <OfflineStore/>
        <Upload/>
        <Pouchdb/>
      </div>
  )
}

export default App

