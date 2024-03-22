import React ,{useState,useCallback} from 'react'
import ReactDOM from 'react-dom/client'


export default function Taskbar(opt){

    return(
        <>
        <button className = 'taskBtn'  id= '+obj' disabled = {opt.state}  onClick = {opt.add}>Add Objects</button>
        <button className = 'taskBtn' onClick = {opt.pages}>Add Pages</button>
        <button className = 'taskBtn' onClick = {opt.remove}>Remove Page</button>
        <button className = 'taskBtn' onClick = {opt.save} disabled = {opt.state}>Save Page</button>
        </>

    )
} 