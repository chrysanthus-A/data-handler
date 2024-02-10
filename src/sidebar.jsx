import React ,{useState,useCallback,useEffect} from 'react'


export function Sidebar(opt){
    
    
    const CloseSidebar = () =>{
        // sidebar closing logic here
        document.getElementById(opt.parentID).classList.remove('open-sidebar')

    }
    
    return(
        <>
            <div id='exitdiv'><button id = 'exit'type = 'button' onClick={CloseSidebar}>X</button></div>
            <div id='notessection'> </div>
            
            
        </>
    )   
}