import { useState } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import {DataStart} from './pages/index'
import './App.css'
import './index.css'

const form = ReactDOM.createRoot(document.getElementById('form'));
const base= '/data-handler/'
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = {base} element = {<DataStart />} />
          <Route path={`${base}home`} element ={<></>} />
        </Routes>
      </BrowserRouter>
    </div>  
  )
}

form.render(<App />)


