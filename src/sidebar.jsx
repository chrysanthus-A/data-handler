import React ,{useState,useCallback,useEffect} from 'react'
import { Notes } from './inputs'
import { clearChild } from './grid'



export function Sidebar(opt){
    function NotesSection(){
        let notes_length = '9'
        const notesdiv = document.getElementById('notessection')
        try {
            clearChild(notesdiv)
        }
        catch(e){
            console.log(`error on clearing notesdiv ${e}`)
        }
        if (Object.keys(opt.notes[opt.cell_field]).includes(String(opt.cell_id))){
            let usernotes_full = JSON.parse(JSON.stringify(opt.notes[opt.cell_field][opt.cell_id]))
            let i = notes_length
            let notecount = 0
            usernotes_full.reverse()
            let usernotes = usernotes_full.slice(0,notes_length)
            let len = usernotes.length
            let div = document.createElement('div')
            let text = document.createElement('textarea')
            let value =''
            while(i>0 && len>notecount){
                let note = usernotes.pop()
                let note_arr =note.split(';;;')
                note = note_arr[0]
                let date = note_arr[1]
                let time = (new Date([note_arr[1],note_arr[2],'UTC'].join(' ')).toTimeString()).split(' ')[0]
                value += `${date};${time}:  ${note}\n\n`
                // let datetime = document.createElement('label')
                // datetime.innerText = `${date} ${time}`
                // datetime.setAttribute('readonly',true)
                i--
                notecount++
            }
            text.value = value
            text.setAttribute('readonly','true')
            div.appendChild(text)
            // div.appendChild(datetime)
            notesdiv.appendChild(div)
        }
        
    }

    const CloseSidebar = () =>{
        document.getElementById(opt.parentID).classList.remove('open-sidebar')

    }
    
    return(
        <>
            <div id='exitdiv'><button id = 'exit' type = 'button' onClick={CloseSidebar}>X</button></div>
            <div id='notessection'>
                <NotesSection notes = {opt.notes}/>
            </div>
            <div id='new_notes'>
                <Notes parentId ='popup' id = 'notespopup' onclick = {opt.record} SidebarID = 'sidebar' />
            </div>  
        </>
    )   
}