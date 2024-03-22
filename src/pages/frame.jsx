import React ,{useRef} from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from '../components/header';
import {base,getData,clearChild,JSONObject} from '../App'
import {Treeview,getSelection} from '../components/tree'
import Taskbar from '../components/taskbar'
import { Objects } from '../components/objectsbar'
// import { FileImage,FileInput,getFile,TextEdit,Styles} from '../components/objects';
// import {Datagrid} from '../components/grid'
import { MainPage,onDrag,useContent,RemoveObjects} from '../components/Pages';
import { NotificationSystem } from '../components/Notification';


let pages;
let children;
let obj = null;
let node;
let offsetX;
let offsetY;

let pagedata = JSON.parse(window.sessionStorage.getItem('pagedata'));
document.title = pagedata.pg || pagedata.pj
const objects = document.getElementById('objectsbar')  
const objroot = ReactDOM.createRoot(objects)
const headdiv = ReactDOM.createRoot(document.getElementById('headdiv'))
let notify = ReactDOM.createRoot(document.getElementById('Notification'))
headdiv.render(<Header base = {base} />)
let main = document.getElementById('mainContent')
let mainroot = ReactDOM.createRoot(main)
let  garbage = document.getElementById('garbage')

// main.ondragover = (event)=>{event.preventDefault()}
// main.ondrop =  (event) =>place(event,obj,node)

const renderTaskbar = (state)=>{
    taskbar.render(<Taskbar add ={addObjects} destroy={RemoveObjects} remove={RemovePage} pages = {addPages} save = {savePage} state ={state}/>)
    
}
const closepopup = () => {
    objects.classList.remove('open-rightpane')
}

garbage.ondragover =(e)=>{e.preventDefault();}
garbage.ondrop =(e)=>{RemoveObjects(main,getSelection(),pagedata);garbage.classList.remove('open-garbage')}




DisplayPages(pagedata.currentID)


const taskbar = ReactDOM.createRoot(document.getElementById('taskbar'))
renderTaskbar(true)
// document.getElementById('+obj').disabled = true



async function savePage(){
    notify.render(<NotificationSystem state={'saving'} canvas ={'Notification'} />)
    let coll = main.children
    let selected = getSelection()
    let [pgIndex,name,flow] = [selected.index,selected.name,selected.hierarchy]
    let pageID = getPageID(pgIndex,name,flow)
    let content = useContent()
    console.log(content)
    for (let i = 0; i < coll.length;i++){
        let item = coll[i]
        // console.log(item.getAttribute('data-type'))
        let id = item.getAttribute('data-id')
        content[id]['height'] = item.style.height
        content[id]['width'] = item.style.width
        content[id]['x'] = item.style.left
        content[id]['y'] = item.style.top
    } 
    let form = new FormData()
    // form.append('content',JSONObject({content:content,workspace:pagedata.ws,project:pagedata.pj,flow:flow.split('-//-'),page:pageID},100),'content')
    // console.log(JSONObject({content:content,workspace:pagedata.ws,project:pagedata.pj,flow:flow.split('-//-'),page:pageID},100))
    // console.log(JSON.stringify({content:content,workspace:pagedata.ws,project:pagedata.pj,flow:flow.split('-//-'),page:pageID}))
    let options = {
                    method:'POST',
                    body:JSONObject({content:content,workspace:pagedata.ws,project:pagedata.pj,flow:flow.split('-//-'),page:pageID},100),
                    // body:form,
                }
    let data = await getData('/save/page',options)
    console.log(data)
    notify.render(<NotificationSystem state={'sucess'} canvas ={'Notification'} />)
    

}

async function DisplayPages(open = null){
    const myoption = {method:'POST',body:JSON.stringify({workspace:pagedata.ws,project:pagedata.pj,page:pagedata.pg})}
    let data = await getData('/open',myoption)
    pages = data.pages
    children = data.childlist
    let expanded = open?[open]:null
    console.log(expanded);
    const leftainer = ReactDOM.createRoot(document.getElementById('left-pane'))
    leftainer.render(<Treeview data = {data.pagesTree}  selected = {expanded} root='Pages' control={showContent}/>)
    
}

function getPageID(pgIndex,name,flow){
    if (flow==='root')
        return pages[pgIndex][name]
    else{
        let hier = flow.split('-//-')
        let root = hier.shift()
        let space = children[root]
        while (hier.length > 1){
            space = space[root]
            root = hier.shift()
        }
        return space[hier.shift()]['id']
    }
    
    
}   

async function showContent() {
    //pages reference available here
    clearChild(main)
    let selected = getSelection()
    let [pgIndex,name,flow] = [selected.index,selected.name,selected.hierarchy]
    let pageID = getPageID(pgIndex,name,flow)
    let option = {method :'POST',body:JSON.stringify({workspace:pagedata.ws,project:pagedata.pj,flow:flow.split('-//-'),page:pageID})}
    let data = await getData('/page/content',option)
    let content = data.content.content
    console.log(content)
    renderTaskbar(false)
    mainroot.render(<MainPage canvas={'mainContent'} pagedata={pagedata} sidebar ={objects} objroot={objroot} closepopup = {closepopup} content ={content} notify = {notify} />)


}
async function RemovePage(){
    let selection = getSelection()
    console.log(selection)
    let options = {
        method:'POST',
        body:JSON.stringify({WSname:pagedata.ws,Pname:pagedata.pj,PGname:selection.name,flow:selection.hierarchy.split('-//-')})
        }
    let response = await getData('/pages/delete',options)
    console.log(response)
    DisplayPages()

}


function addPages(){
    const popup = document.getElementById('popup')
    const closepopup = () => {
        popup.classList.remove('open-popup')
    }
    async function add(){
        let ws = pagedata.ws
        let pj = pagedata.pj
        let pg  = document.getElementById('pg-name').value
        let [parent,p_index] = document.getElementById('pg_type').value ==='Child'?document.getElementById('parent_drop').value.split(','):[null,null]
        let parent_id = parent?pages[p_index][parent]:null
        let myOptions = {
            method :'POST',
            body: JSON.stringify({Pname:pj,WSname:ws,PGname:pg,parent:parent_id})
        }
        let response = await getData('/pages/tree',myOptions)
        if (response.code === 405)
            document.getElementById('error-log').innerHTML = response.status
        else{
            DisplayPages()
        }

    }
    async function getparentlist(){
        let child_div = document.getElementById('child_info')
        child_div.style.display = 'inherit'
        let options={
                    method: 'POST',
                    body:JSON.stringify({workspace:pagedata.ws,project:pagedata.pj})
                    }
        let data = await getData('/pages',options)
        let parents = document.getElementById('parent_drop')
        data[0].forEach((page,index) => {
            let opt = document.createElement('option')
            // opt.setAttribute('data-index',index)
            opt.value = [page,index]
            opt.innerHTML = page
            parents.appendChild(opt)    
        });

    }
    let popupdom  = ReactDOM.createRoot(popup)
    popupdom.render(
        <div className ='container2'>
            <div className='exitButton'>
                <button type = 'button' onClick={closepopup} id = 'exitButton'>X</button>
            </div>
            <div className='ws-name-input'>
                {/* <label htmlFor="ws-name">Workspace Name:</label>
                <input type="text" className='ws-name' id='ws-name' placeholder='Select Workspace' list = 'ws-data' autoComplete='false' onChange={(e)=>wslist({pj:true,ws_name:e.target.value})}  />*/}
                <label htmlFor="page_type">Page Type</label>
                <select name="page_type" className='ws-name' id='pg_type' placeholder='choose Page Type'  onChange = {(event)=>{event.target.value==='Child'?getparentlist():document.getElementById('child_info').style.display = 'none'}}>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                </select>
                <div id='child_info' className='ws-name-input' style ={{display:'none'}}>
                <label htmlFor="ws-name">Parent Node</label>
                <select name="parent" id="parent_drop" className = "ws-name" >
                    <option value={null} defaultValue={true}>Select Parent Node</option>
                </select>
                </div>
                <label htmlFor="ws-name">Page Name</label>
                <input type="text" className='ws-name' id='pg-name' placeholder={`Enter the name of the Page here`} onKeyDown={(event) =>{if (event.key ==='Enter') {event.preventDefault();add();event.target.value = ''}}} />
                <label id='error-log'></label>                        
            </div>
            <div className='submit-button'>
                <button type='button'onClick={()=>{add()}}>Create</button>
            </div>
        </div>
    )
    popup.classList.add('open-popup')
}

function addObjects(){
    objroot.render(<Objects close = {closepopup}  drag = {(event)=>{onDrag(event);closepopup()}}/>)
    objects.classList.add('open-rightpane')
}
// const updateNode = (event)=>{
//     node = event.target
//     let rect = node.getBoundingClientRect()
//     offsetX = event.clientX - rect.x;
//     offsetY = event.clientY - rect.y;
// }

// export function draggablediv(target){
//     let div = document.createElement('div')
//     div.classList.add('resizable')
//     div.setAttribute('data-type',target)
//     div.draggable = true
//     div.ondragstart=(e)=>{obj = 'existing';updateNode(e)}
//     div.style.margin = '5px'
//     div.style.padding = '2px'
//     div.style.border = '1px solid black'
//     div.style.position = 'absolute'
//     div.style.height='250px'
//     div.style.width='500px'
//     return div
// }
// async function place(event,target,node){
//     let div;
//     console.log(event,target);
//     const clear=()=>{obj = null}
//     switch(target){
//         case 'text':
//             clear();
//             div = draggablediv(target)
//             // Normal Text area
//             // let textarea = document.createElement('textarea')
//             // textarea.ondragover = (e) =>{e.preventdefault()}
//             // div.appendChild(textarea)
//             // div.style.top = String(document.documentElement.scrollTop+event.offsetY)+'px'
//             // div.style.left = String(document.documentElement.scrollLeft+event.offsetX)+'px'
//             // main.appendChild(div)
//             // Rich text Editor
//             let textarea = ReactDOM.createRoot(div)
//             textarea.render(<TextEdit styles={onstyles} close ={closepopup}/>)
//             div.style.top = String(document.documentElement.scrollTop+event.offsetY)+'px'
//             div.style.left = String(document.documentElement.scrollLeft+event.offsetX)+'px'
//             main.append(div)
//             function onstyles(event,editor){
                
//                 objroot.render(<Styles editor = {editor} close = {closepopup}/>)
//                 event.ctrlKey?objects.classList.add('open-rightpane'):null
//             }

//             break
//         case 'grid':
//             clear()
//             div = draggablediv(target)
//             let grid = ReactDOM.createRoot(div)
//             grid.render(<FileInput  
//                         carryon = {onfileready} 
//                         accept = {['Text/csv']} 
//                         message ={'Drop Csv files here or click to choose a file'}
//                         />)
//             div.style.top = String(document.documentElement.scrollTop+event.offsetY)+'px'
//             div.style.left = String(document.documentElement.scrollLeft+event.offsetX)+'px'
//             main.append(div)
//             async function onfileready(file){
//                 let [data,ext]= await processfile(file)
//                 let [rows,columns,formulas,headers,notes]=await processdata(data,ext)
//                 // console.log(rows,columns,formulas,headers,notes)
//                 grid.render(<Datagrid pagesize = {30} rowData={rows} columnDefs={columns} headers={headers} notesdict={notes} formulas = {formulas} page = {pagedata} />)

//             }
//             break
//             // file = {JSON.stringify(data.defaultpage.content)}
            
//         case 'picture':
//             clear()
//             div = draggablediv(target)
//             let pict = ReactDOM.createRoot(div)
//             pict.render( <FileInput  
//                         carryon = {onIMGready} 
//                         accept = {['image/*']} 
//                         message = {'drop image files here or click to choose a img'}
//                         />)
//             async function onIMGready(file){
//                 console.log(file)
//                 let data = await processImage(file)
//                 console.log(data)
//                 pict.render(<FileImage source = {data}/>)
//             }
//             div.style.top = String(document.documentElement.scrollTop+event.offsetY)+'px'
//             div.style.left = String(document.documentElement.scrollLeft+event.offsetX)+'px'
//             main.append(div)
//             break
//         case 'existing':
//             clear()
//             const left = parseInt(window.getComputedStyle(event.target).left)
//             const top = parseInt(window.getComputedStyle(event.target).top)
//             // console.log('left',left,'top',top)
//             node.style.left = event.clientX - left - offsetX + 'px';
//             node.style.top = event.clientY  - top- offsetY + 'px';
//             break
//     }
// }



