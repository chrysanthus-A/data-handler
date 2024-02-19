import React  from 'react'
import ReactDOM from 'react-dom/client';
import { Login } from '../components/user_login';


let api = 'https://chrysrex.pythonanywhere.com/'
const leftainer = ReactDOM.createRoot(document.getElementById('left-pane'))
leftainer.render(<Login  base = {api} on_success = 'home'/>)
    

