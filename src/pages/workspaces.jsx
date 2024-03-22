import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import { Header } from '../components/header';
import {Treeview,getSelection} from '../components/tree';
import {Manage} from '../components/manage';
import {base,getData} from '../App';
// import { Button } from '../components/inputs';

const header = ReactDOM.createRoot(document.getElementById('headdiv'))
const popup = ReactDOM.createRoot(document.getElementById('popup'))
const btndiv = ReactDOM.createRoot(document.getElementById('buttonsdiv'))
let current_data=''
const onvaluechange= async (event) =>{
    let options = {method:'GET'}
    let data;
    let type = event.target.value || "Workspaces"
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
header.render(<Header base = {base} onchange = {onvaluechange} />)
const buttons = (
    <>
        <button type="button" id='open_btn' onClick={openSelected}>Open Model</button>
        <button type="button" onClick={manageWorkspace}>Manage Models</button>
    </>
    )
btndiv.render(buttons)

async function openSelected(){
    let selection = getSelection()
    console.log(selection)
    let hierarchy = selection.hierarchy.split('-//-')
    try{
        let ws = hierarchy[0]
        let pj = hierarchy[1]
        let pg = hierarchy[2]
        let data =  {}
        data.ws = ws
        data.pj = pj
        data.pg = pg ||null
        data.heirID = selection.hierarchy_ID
        data.currentID =selection.selectedID
        window.sessionStorage.setItem('pagedata', JSON.stringify(data))
        console.log(data);//to be deleted    
        window.location.replace('/data-handler/frontpage')
    }
    catch (e) {console.log(e)}  

}


export function DisplayTree(opt,div,root = 'Workspaces',expanded = ['root']){
    let main_div = document.getElementById(div)
    let main = ReactDOM.createRoot(main_div)
    console.log(opt);
    main_div.addEventListener('click',() =>{
        let selection = getSelection()
        if (selection.type !== 'Workspaces')
            document.getElementById('open_btn').disabled = false
        else
            document.getElementById('open_btn').disabled = true

    })
    main.render(<Treeview data = {opt}  default = {expanded} root={root}/>)

}


async function manageWorkspace(){
    const popupdom = document.getElementById('popup')
    const closepopup = () => {
        popupdom.classList.remove('open-popup')
    }
    popupdom.classList.add('open-popup');
    popup.render(<Manage close={closepopup} />);
    

}



