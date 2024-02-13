import React ,{useState,useCallback,useEffect} from 'react'
import { Notes } from './inputs'



export function Sidebar(opt){
    
    
    const CloseSidebar = () =>{
        // sidebar closing logic here)
        // const notesdiv = document.getElementById('notessection')
        // let child = notesdiv.lastElementChild
        // while (child){
        //     notesdiv.removeChild(child)
        //     child = notesdiv.lastElementChild
        //     }
        document.getElementById(opt.parentID).classList.remove('open-sidebar')

    }
    
    return(
        <>
            <div id='exitdiv'><button id = 'exit' type = 'button' onClick={CloseSidebar}>X</button></div>
            <div id='notessection'>
            </div>
            <div id='new_notes'>
                <Notes parentId ='popup' id = 'notespopup' onclick = {opt.record} SidebarID = 'sidebar' />
            </div>
            
            
        </>
    )   
}