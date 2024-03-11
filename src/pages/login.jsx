import React  from 'react'
import ReactDOM from 'react-dom/client';
import { Login } from '../components/user_login';
import {base} from '../App'


const leftainer = ReactDOM.createRoot(document.getElementById('left-pane'))
leftainer.render(<Login  base = {base} on_success = 'workspace'/>)
    

