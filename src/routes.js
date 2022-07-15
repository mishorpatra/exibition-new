import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalView from './components/GlobalView';
import Home from './components/Home'
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import Settings from './components/Settings';
import Locate from './components/Locate';
import SharedView from './components/SharedView'


const BaseRouter = ()=>{

    const [darkmode, setDarkmode] = useState(true)
    const [user, setUser] = useState()
    return(
    <Routes>   
            <Route exact path='/signin' element={<Login setUser={setUser} user={user} darkmode={darkmode} setDarkmode={setDarkmode} />} />
          <Route exact path='/signup' element={<Signup darkmode={darkmode} setDarkmode={setDarkmode} />} />
          <Route exact path='/' element={<Home user={user} setUser={setUser} darkmode={darkmode} setDarkmode={setDarkmode} />} />
          <Route exact path='/settings' element={<Settings />} /> 
          <Route exact path='/locate/:id' element={<Locate />} />
          <Route exact path='/share' element={<SharedView darkmode={darkmode} setDarkmode={setDarkmode} />} />
    </Routes>)
}

export default BaseRouter