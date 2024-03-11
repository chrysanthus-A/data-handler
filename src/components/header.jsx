import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import F_icon from '../assets/F.png';
import {DisplayTree} from '../pages/workspaces'
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
    const onvaluechange= async (event) =>{
        let options = {method:'GET'}
        let data;
        let type = event.target.value
        switch(type){
            case 'Workspaces':
                data = await getData('/workspaces/tree',options);
                DisplayTree(data,'filediv',type)
                break;
            case 'Projects':
                data = await getData('/projects/tree',options);
                DisplayTree(data,'filediv',type)
                break;
            case 'Pages':
                data = await getData('/pages/tree',options);
                DisplayTree(data,'filediv',type)
                break;
        }
    }
    function assignclass(){
        const dropdown = document.getElementById('header-dropdown')
        let child_count = dropdown.length;
        for(let i =0; i<child_count; i++){
            dropdown[i].className = 'items';    
        }    
    }
    return (
        <>
            <img src= {F_icon} alt="Fervid Pro LTD" className='logo' onLoad={async ()=>{let data = await getData('/workspaces/tree',{method:'GET'});(DisplayTree(data,'filediv','Workspaces'))}}/>    
            <select name="dropdown" id="header-dropdown" onClick={assignclass} onChange={onvaluechange}>
                <option value="Workspaces" defaultValue={true}>Workspaces</option>
                <option value="Projects">Projects</option>
                <option value="Pages">Pages</option>
            </select>
        </>
    )

}

