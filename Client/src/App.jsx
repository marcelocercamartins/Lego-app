import './App.css'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Content from './components/Content'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import IsPrivate from "./components/IsPrivate";
import CreatePost from "./components/CreatePost";
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Favorites from './components/Favorites';



function App() {
  return (
      <BrowserRouter>
        <Navbar />
          <Routes>
              <Route path='/' element= {<HomePage />}/>
              <Route path='/aboutus' element= {<AboutPage />}/>
              <Route path='/signup' element= {<SignUp />}/>
              <Route path='/login' element= {<Login />}/>
              <Route path='/favorites' element= {<IsPrivate> <Favorites/> </IsPrivate>}/>
              <Route path='/content' element= {<IsPrivate> <Content/> </IsPrivate>}/>
              <Route path='/createPost' element= {<IsPrivate> <CreatePost/> </IsPrivate>}/>
          </Routes>
      </BrowserRouter>
  );
}
 
export default App;