import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import { DisplayTree } from '../pages/workspaces';
import {base} from '../App'
import {getSelection} from './tree';

const popupdom = document.getElementById('popup2')
const popup2 = ReactDOM.createRoot(popupdom)
let current_options = ''

export async function getData(param,options){
    let token = window.sessionStorage.getItem('token')
    options.headers = {auth:token||null}
    let req = new Request(base+param,options)
    let data=  await fetch(req)
    data = await data.json()
    try{data.code!==200 ? window.location.replace('/data-handler/login'): null}
    catch{}   
    return data.data
}
export  function Manage(opt) {
    const[selected,updateoption] = useState('Workspaces')
    useEffect(() =>{
            current_options = selected
        },[selected])

    const handlebtnClick = async (e) =>{
        const tabdiv = document.getElementById('tabs')
        tabdiv.childNodes.forEach((element)=>{element.classList.remove('btn-clicked')})
        e.target.classList.add('btn-clicked')
        await tabsData(e.target.innerHTML,'listdiv')
    }
    async function tabsData(type,div,id=null){
        let options ={method: 'GET'}
        let data;
        switch(type){
            case 'Workspaces':
                updateoption('Workspaces')
                data = await getData('/workspaces/tree',options)
                // rm.disabled=false
                // rename.disabled=false
                break;
            case 'Projects':
                updateoption('Projects')
                data = await getData('/projects/tree',options)
                // rm.disabled=true
                // rename.disabled=true
                break;
            case 'Pages':
                updateoption('Pages')
                data = await getData('/pages/tree',options)
                // rm.disabled=true
                // rename.disabled=true
                break;
        }
        DisplayTree(data,div,type,id)
    }
    async function modifyObjects(){
        let selection = getSelection()
        const closepopup = () => {
            popupdom.classList.remove('open-popup2')
        }
        popupdom.classList.add('open-popup2');
        popup2.render(<Rename close={closepopup} type={selection.type} name={selection.name} data={selection}/>); 

    }

    function Rename(opt){
        async function changename(type,oldname,selection){
            let new_name = document.getElementById('new-name').value
            let myOptions;
            let response;
            let parents;
            let ws;
            let pj;
            switch(type){
                case 'Workspaces':
                    myOptions = {
                        method :'POST',
                        body: JSON.stringify({WS_old:oldname,WS_new:new_name}),
                    }
                    response = await getData('/workspaces/rename',myOptions); 
                    break;
                case 'Projects':
                    parents = selection.hierarchy.split('-//-')
                    ws = parents[0]
                    myOptions = {
                        method :'POST',
                        body: JSON.stringify({Pold:oldname,Pnew:new_name,WSname:ws}),
                    }
                    response = await getData('/projects/rename',myOptions);
                    break;
                case 'Pages':
                    parents = selection.hierarchy.split('-//-')
                    ws = parents[0]
                    pj = parents[1]
                    myOptions = {
                        method :'POST',
                        body: JSON.stringify({PGold:oldname,PGnew:new_name,WSname:ws,Pname:pj}),
                    }
                    response = await getData('/pages/rename',myOptions);
                    break;
                }
            tabsData(current_options,'listdiv',selection.hierarchy_ID.split('-//-'))
        }
        return (
            <div className ='container2'>
            <div className='exitButton'>
                <button type = 'button' onClick={opt.close}>X</button>
            </div>
            <div className='ws-name-input'>
                <label htmlFor="ws-name">Selected Type: {opt.type}</label>
                <label htmlFor="ws-name">Current Name: {opt.name}</label>
                <label htmlFor="ws-name">New Name:</label>
                <input type="text" className='ws-name' id='new-name' placeholder={`Type new name here`}/>
            </div>
            <div className='submit-button'>
                <button type='button' onClick={()=>changename(opt.type,opt.name,opt.data)}>Rename</button>
            </div>
            </div>
            )
    }

    async function removeObjects(){
        let selection = getSelection();
        let response;
        let options;
        switch(selection.type){
            case 'Workspaces':
                options = {
                    method:'POST',
                    body:JSON.stringify({WSname:selection.name})
                    }
                response = await getData('/workspaces/delete',options)
                break;
            case 'Projects':
                options = {
                    method:'POST',
                    body:JSON.stringify({WSname:selection.ws,Pname:selection.name})
                    }
                response = await getData('/projects/delete',options)
                break;
            case 'Pages':
                options = {
                    method:'POST',
                    body:JSON.stringify({WSname:selection.ws,Pname:selection.project,PGname:selection.name})
                    }
                response = await getData('/pages/delete',options)
                break;
            default:
                break;
            }
        tabsData(selected,'listdiv',selection.hierarchy_ID.split('-//-').slice(0,-1))
    
    }

    function addObjects(){
        const closepopup = () => {
            try{
                document.getElementById('error-log').innerHTML = ''
                document.getElementById('ws-name').value = ''
                document.getElementById('pj-name').value = ''
                document.getElementById('pg-name').value = ''
            }
            catch{}
            popupdom.classList.remove('open-popup2')

        }
        popupdom.classList.add('open-popup2');
        popup2.render(<AddWs close={closepopup}/>); 
    }

    function AddWs(opt){
        async function add({ws=false,pj=false,pg=false}){
            let token =window.sessionStorage.getItem('token')
            let response ;
            if (ws){
                let ws_name = document.getElementById('ws-name').value
                let myOptions = {
                    method :'POST',
                    body: JSON.stringify({name: ws_name}) ,
                }
                response =  await getData('/workspaces/tree',myOptions)
            }
            else if (pj){
                let proj_name = document.getElementById('pj-name').value
                let ws_name = document.getElementById('ws-name').value
                let myOptions = {
                    method :'POST',
                    body: JSON.stringify({Pname: proj_name,w_name:ws_name}), 
                }
                response = await getData('/projects/tree',myOptions)
            }
            else if (pg){
                let proj_name = document.getElementById('pj-name').value
                let ws_name = document.getElementById('ws-name').value
                let pg_name = document.getElementById('pg-name').value
                let myOptions = {
                    method :'POST',
                    body: JSON.stringify({Pname: proj_name,WSname:ws_name,PGname:pg_name}),
                }
                response = await getData('/pages/tree',myOptions)
            }
                if (response.code === 405)
                    document.getElementById('error-log').innerHTML = response.status
                else
                    tabsData(current_options,'listdiv')
            
        }
        
        async function wslist({ws=false,pj=false,ws_name=null,clear=false}){
            try {
                if (ws || clear){document.getElementById('ws-data').remove()}
                if (pj || clear){document.getElementById('pj-data').remove()}
            }
            catch{}
            const myOptions = {
                method :'GET',
            }
            if (ws){
                // let req = new Request(base + '/workspaces',myOptions)
                let response = await getData('/workspaces',myOptions)
                let dl = document.createElement('datalist')
                dl.id= 'ws-data'
                console.log(response);
                response.forEach(ws => {
                    let op = document.createElement('option')
                    op.setAttribute('value',ws)
                    dl.appendChild(op)
                });
                document.body.appendChild(dl)    
            }
            if (pj){
                myOptions.method = 'POST'
                myOptions.body = JSON.stringify({wsName:ws_name})
                let response = await getData('/projects',myOptions)
                let dl = document.createElement('datalist')
                dl.id= 'pj-data'
                console.log(response);
                response.forEach(ws => {
                    let op = document.createElement('option')
                    op.setAttribute('value',ws)
                    dl.appendChild(op)
                });
                document.body.appendChild(dl)
            }
        }
        
        if (current_options === 'Workspaces'){
            wslist({clear:true})
            return (
            <div className ='container2'>
            <div className='exitButton'>
                <button type = 'button' onClick={opt.close}>X</button>
            </div>
            <div className='ws-name-input'>
                <label htmlFor="ws-name">{current_options} Name:</label>
                <input type="text" className='ws-name' id='ws-name' placeholder={`Enter the name of the ${current_options} here`}  />
                <label id='error-log'></label>
            </div>
            <div className='submit-button'>
                <button type='button' onClick={()=>{wslist({clear:true});add({ws:true})}}>Create</button>
            </div>
            </div>
            )
        }
        if (current_options==='Projects'){
            wslist({ws:true})
            return(
                <div className ='container2'>
                    <div className='exitButton'>
                        <button type = 'button' onClick={opt.close}>X</button>
                    </div>
                    <div className='ws-name-input'>
                        <label htmlFor="ws-name">Workspace Name:</label>
                        <input type="text" className='ws-name' id='ws-name' placeholder={`Enter Workspace Name`} list = 'ws-data' autoComplete='false' />
                        <label htmlFor="ws-name">{current_options} Name:</label>
                        <input type="text" className='ws-name' id='pj-name' placeholder={`Enter the name of the ${current_options} here`}  />
                        <label id='error-log'></label>
                    </div>
                    <div className='submit-button'>
                        <button type='button'onClick={()=>{wslist({clear:true});add({pj:true})}}>Create</button>
                    </div>
                </div>
            )
            }
            // TODO : write logic for adding pages to project
        if (current_options==='Pages'){
            wslist({ws:true})
            return(
                <div className ='container2'>
                    <div className='exitButton'>
                        <button type = 'button' onClick={opt.close}>X</button>
                    </div>
                    <div className='ws-name-input'>
                        <label htmlFor="ws-name">Workspace Name:</label>
                        <input type="text" className='ws-name' id='ws-name' placeholder='Select Workspace' list = 'ws-data' autoComplete='false' onChange={(e)=>wslist({pj:true,ws_name:e.target.value})}  />
                        <label htmlFor="ws-name">Project Name:</label>
                        <input type="text" className='ws-name' id='pj-name' placeholder='Select Project'  list = 'pj-data' autoComplete='false' />
                        <label htmlFor="ws-name">{current_options} Name:</label>
                        <input type="text" className='ws-name' id='pg-name' placeholder={`Enter the name of the ${current_options} here`}  />
                        <label id='error-log'></label>                        
                    </div>
                    <div className='submit-button'>
                        <button type='button'onClick={()=>{wslist({clear:true});add({pg:true})}}>Create</button>
                    </div>
                </div>
            )
        }
    }
        
    
    return (
    <div className ='container'>
        <div className='exitButton'>
            <label ><h4>Manage {selected}</h4></label>
            <button type = 'button' onClick={opt.close}>X</button>
        </div>
        <div className='tabs' id = 'tabs'>
            <button className='tabBtns' onClick = {handlebtnClick} >Workspaces</button>
            <button className='tabBtns' onClick = {handlebtnClick} >Projects</button>
            <button className='tabBtns' onClick = {handlebtnClick}>Pages</button>
        </div>
        <div className='main'>
            <div className='lists' id='listdiv'></div>
            <div className='actions'>
                <button type='button' onClick={addObjects}id='addBtn'>Add</button>
                <button type='button' onClick={removeObjects} id='removeBtn'>Remove</button>
                <button type='button' onClick={modifyObjects} id='renameBtn'>Rename</button>
            </div>
        </div>
    
    </div>
    )
}
