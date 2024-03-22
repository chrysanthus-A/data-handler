import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import F_icon from '../assets/F.png';
import { getData } from '../App.jsx';
// import {get_current_session} from '../App.jsx'


export function Header(opt){
    let base= opt.base
    // async function getDatas(param){
    //     let token = window.sessionStorage.getItem('token')
    //     let head = new Headers();
    //     head.append('auth',token||'null')
        
    //         headers:head
    //     }
    //     let req = new Request(base+param,myoptions)
    //     let data=  await fetch(req)
    //     data = await data.json()
    //     try{data.code===401 ? window.location.replace('/data-handler/login'): null}
    //     catch{}   
    //     return data
    // }
    
    function assignclass(){
        const dropdown = document.getElementById('header-dropdown')
        let child_count = dropdown.length;
        for(let i =0; i<child_count; i++){
            dropdown[i].className = 'items';    
        }    
    }
    return (
        <>
            <img src= {F_icon} alt="Fervid Pro LTD" className='logo' onLoad={opt.onchange}/>    
            <select name="dropdown" id="header-dropdown" onClick={assignclass} onChange={opt.onchange}>
                <option value="Workspaces" defaultValue={true}>Workspaces</option>
                <option value="Projects">Projects</option>
                <option value="Pages">Pages</option>
            </select>
        </>
    )

}
//async ()=>{let data = await getData('/workspaces/tree',{method:'GET'});(DisplayTree(data,'filediv','Workspaces'))

