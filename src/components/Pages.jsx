import React ,{useRef,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Datagrid} from '../components/grid'
import {FileImage,FileInput,getFile,TextEdit,Styles} from '../components/objects';
import {getData,getId,processImage,processdata,processfile,isEmpty} from '../App'
import { NotificationSystem } from './Notification.jsx';


// let grid_ref;
let obj;
let node;
let info
let offsetX;
let offsetY;
let content;
export function onDrag(event){
    obj = event.target.getAttribute('data-obj')
}
export function useContent(update=null,id){
    if (update){
        content[id].data = update
        return content
    }
    else 
    return content
}
export async function RemoveObjects(from,current,pagedata){
    let componentID = node.getAttribute('data-id')
    console.log(current);
    console.log(componentID)
    let options = {
        method:'POST',
        body: JSON.stringify({componentID:componentID , workspace:pagedata.ws , project:pagedata.pj , flow:current.hierarchy.split('-//-')})
    }
    let data = await getData('/destroy/component',options)
    console.log(data)
    if (data.code ===200)
        from.removeChild(node)
}

export function MainPage(opt){
    content = opt.content
    let main  = document.getElementById(opt.canvas)
    main.ondragover = (event)=>{event.preventDefault()}
    main.ondrop =  (event) =>{place(event,obj,node);document.getElementById('garbage').classList.remove('open-garbage')}
    
    console.log('content is empty?',isEmpty(content))
    if (!isEmpty(content)){
        Object.keys(content).forEach((key)=>{   
            let item = content[key]
            item['id'] = key
            place(null,item.type,node,item)

        });


    }
    const updateNode = (event)=>{
        node = event.target
        let rect = node.getBoundingClientRect()
        offsetX = event.clientX - rect.x;
        offsetY = event.clientY - rect.y;
    }

    function draggablediv(target,id,info =null ){
        let div = document.createElement('div')
        div.classList.add('resizable')
        div.setAttribute('data-type',target)
        div.setAttribute('data-id',id)
        div.draggable = true
        div.ondragstart=(e)=>{obj = 'existing';updateNode(e);document.getElementById('garbage').classList.add('open-garbage');opt.closepopup()}
        div.style.margin =  '5px'
        div.style.padding = '2px'
        div.style.border = '1px solid black'
        div.style.position = 'absolute'
        div.style.height=info?info.height :'250px'
        div.style.width=info?info.width :'500px'
        return div
    }
    async function place(event,target,node,info=null){
        let div;
        let id ;
        console.log(info);
        const clear=()=>{obj = null}
        const provideID= ()=>{
            id  = getId('None',5)
            while(Object.keys(content).includes(id)){
                id  = getId(size = 5)
            }
            content[id] = {type:target}
            return id
        }
        switch(target){
            case 'text':
                clear();
                id = info?info.id: provideID()
                div = draggablediv(target,id,info)
                // Normal Text area
                // let textarea = document.createElement('textarea')
                // textarea.ondragover = (e) =>{e.preventdefault()}
                // div.appendChild(textarea)
                // div.style.top = String(document.documentElement.scrollTop+event.offsetY)+'px'
                // div.style.left = String(document.documentElement.scrollLeft+event.offsetX)+'px'
                // main.appendChild(div)
                // Rich text Editor
                
                let textarea = ReactDOM.createRoot(div)
                let editor_content = info?info.data:'start Typing here'
                textarea.render(<TextEdit styles={onstyles} close ={opt.closepopup} save={(data)=>useContent(data,id)} content = {editor_content} />)
                div.style.top = info?info.y : String(document.documentElement.scrollTop+event.offsetY)+'px'
                div.style.left = info?info.x : String(document.documentElement.scrollLeft+event.offsetX)+'px'
                main.append(div)
                function onstyles(event,editor){
                    const save =()=>{
                        opt.notify.render(<NotificationSystem state={'saving'} canvas ={'Notification'} />)
                        useContent(editor.getHTML(),id)
                        opt.notify.render(<NotificationSystem state={'sucess'} canvas ={'Notification'} />)
                    }
                    opt.objroot.render(<>
                                <Styles  id = {id} editor = {editor} close = {opt.closepopup}/>
                                <button onClick={save}>Save</button>
                                </>)
                    event.ctrlKey?opt.sidebar.classList.add('open-rightpane'):null
                }

                break
            case 'grid':
                clear()
                id = info?info.id: provideID()
                div = draggablediv(target,id,info)
                let grid = ReactDOM.createRoot(div)
                info?onfileready(info.data,true):
                grid.render(<FileInput  
                            carryon = {onfileready} 
                            accept = {['Text/csv']} 
                            message ={'Drop Csv files here or click to choose a file'}
                            />)
                div.style.top =info?info.y: String(document.documentElement.scrollTop+event.offsetY)+'px'
                div.style.left = info?info.x :String(document.documentElement.scrollLeft+event.offsetX)+'px'
                main.append(div)

                async function onfileready(file,exist=false){
                    let [data,ext]= exist?[file.data,'json']:await processfile(file)
                    let [rows,columns,formulas,headers,notes]=exist?[data.rows,data.colformat,data.formula,data.coldef,data.notes] :await processdata(data,ext)
                    
                    grid.render(<Datagrid  notify = {opt.notify} ID={id} save={useContent} pagesize = {30} rowData={rows} columnDefs={columns} headers={headers} notesdict={notes} formulas = {formulas} page = {opt.pagedata} />)
                    let dataJSON = {coldef : headers , rows : rows ,formula : formulas , colformat :columns ,notes:notes}
                    let saved= {data:dataJSON,name:file.name,workspace:opt.pagedata.ws,project:opt.pagedata.pj,page:opt.pagedata.pg||null}
                    useContent(saved,id)

                }
                break
                // file = {JSON.stringify(data.defaultpage.content)}
                
            case 'picture':
                clear()
                id = info?info.id: provideID()
                div = draggablediv(target,id,info)
                let pict = ReactDOM.createRoot(div)
                info?onIMGready(info.data,true):
                pict.render( <FileInput  
                    carryon = {onIMGready} 
                    accept = {['image/*']} 
                    message = {'drop image files here or click to choose a img'}
                    />)
                async function onIMGready(file,exist=false){
                    let data = exist?file:await processImage(file)
                    pict.render(<FileImage source = {data}/>)
                    let reader = new FileReader()
                    reader.addEventListener('load',()=>{console.log(reader.result);useContent(reader.result,id)})
                    reader.readAsDataURL(file[0])
                    // useContent(file,id)
                }
                    div.style.top = info?info.y: String(document.documentElement.scrollTop+event.offsetY)+'px'
                    div.style.left = info?info.x : String(document.documentElement.scrollLeft+event.offsetX)+'px'
                main.append(div)
                break
            case 'existing':
                clear()
                const left = parseInt(window.getComputedStyle(event.target).left)
                const top = parseInt(window.getComputedStyle(event.target).top)
                // console.log('left',left,'top',top)
                node.style.left = event.clientX - left - offsetX + 'px';
                node.style.top = event.clientY  - top- offsetY + 'px';
                break
        }
    }
    return null
}