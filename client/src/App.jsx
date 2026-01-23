import './App.css'
import  Upload  from './pages/upload'
import { Signup } from './Auth/Signup'
import { Login } from './Auth/Login'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext, { AuthProvider } from './components/Context'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'sonner'

export function AppRoutes(){
  const {isAuthenticated,loading}=useContext(AuthProvider)
  if (loading) return <div className="p-10 text-center">Loading ShareSphere...</div>;
  return(
    <BrowserRouter>
       <Routes>
            <Route path='/signup' element={isAuthenticated? <Navigate to="/" replace/> : <Signup/>}/>  //Adding the replace attribute in "Navigate to="/" replace"  is important.
             It prevents the /login or /signup page from being saved in the browser's back-button history
            <Route path='/login' element={isAuthenticated? <Navigate to="/" replace/> : <Login/>}/>
            <Route path="/" element={
                isAuthenticated ? <Dashboard/> : <Navigate to="/login"/>
            }/>
            <Route path='/upload' element={
              isAuthenticated  ? <Upload/> : <Navigate to="/login"/>
            }/>
          <Route path='*' element={<Navigate to="/"/>}/>
          </Routes>
        </BrowserRouter>
  )
}
function App() {
  return (
    <AuthContext>
      <div>
        <Toaster richColors closeButton />
          <AppRoutes/>
      </div>
    </AuthContext>
  )
}

export default App;

