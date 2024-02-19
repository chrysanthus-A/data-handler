import React ,{useState,useCallback} from 'react'
import ReactDOM from 'react-dom/client'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { useMemo } from 'react'
import {processdata} from './grid'
import { Sidebar } from './sidebar';

import '../App.css'

export const TargetBox = (props) => {
    const { onDrop } = props
    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: [NativeTypes.FILE],
            drop(item) {
            if (onDrop) {
                onDrop(item)
                }
            },
            canDrop(item) {
                // console.log('canDrop', item.files, item.items)
                return true
                },
            hover(item) {
                // console.log('hover', item.files, item.items)
                },
            collect: (monitor) => {
                const item = monitor.getItem()
                if (item) {
                    // console.log('collect', item.files, item.items)
                    }
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                }
            },
        }),
        [props],
        )
    const isActive = canDrop && isOver
    return (
        <div ref={drop} className='dragspace'>
            <span>{isActive ? 'Release to drop' : 'Drag file here'}</span>
        </div>
        )
    }

function list(files) {
    const label = (file) =>
        `'${file.name}' of size '${file.size}' and type '${file.type}'`
        return (label)
    }

export const FileList = ({ files }) => {
    if (!(files.length === 0)) {
        
    const fileList = useMemo(() => list(files), [files])
    // processfile(fileList)
    }}
async function processfile(files) {
    // var csvfile = document.getElementById('csvfile')
    // var [file] = csvfile.files
    let [file] = files
    document.title = file.name
    var ext = file.name.split('.').pop()
    // console.log(file)
    var filepath = URL.createObjectURL(file)
    var gridfile = await fetch(filepath)
    var data = await gridfile.text() 
    processdata(data,ext)
    
}
export function FileSelect(opt){
    const [droppedFiles, setDroppedFiles] = useState([])
    const handleFileDrop = useCallback(
        (item) => {
            if (item) {
                const files = item.files
                setDroppedFiles(files)
                processfile(files)
                }
        },
        [setDroppedFiles],);
        

    return (
        <>
            <TargetBox onDrop={handleFileDrop} />
        </>
    )

        // return (
        //     <form runat="server">
        //         <button>
        //             <input accept=".csv" type='file' id="csvfile" onChange={opt.func}/>
        //         </button>
            
        //     </form>

        // );

}


export function AddcolPopup(opt){

    const [operations,updateoperations] =useState(['\+','\*','\-','\/']);
    const [cols,update_var] =  useState(opt.headers);

    function closepop() {
        let input = document.getElementById(opt.ID)
        input.removeAttribute('list')
        if (!(typeof opt.parentId === 'undefined')){
            let doc = document.getElementById(opt.parentId);
            doc.classList.remove('open-popup');
        }
    }    
    function closenSubmit () {
        closepop()
        opt.onclick(); 
    }
    return(
            <form>
                <div className='exitButton'>
                    <button type = 'button' onClick = {closepop}></button>
                </div>
                <div className='headername'>   
                    <label htmlFor={opt.ID}>{opt.label}</label>
                    <input  autoComplete= 'off' type="text" id={opt.ID} name = {opt.ID} /> 
                </div>
                <div id = 'formula'>   
                    <PredictiveText datalist={opt.headers.concat(operations)}/>    
                </div>
                <button type='button' onClick = {closenSubmit}>SUBMIT</button>
            </form>
    );
}

export function Input(opt){
    return (
        <input type="text" id={opt.ID} name = {opt.ID} defaultValue= {opt.value} 
        style= {{
            width : opt.width,
            height : opt.height,
            margin : opt.margin,
            fontSize : opt.fsize 
        }} 
        />
    );
}

export function PredictiveText(opt) {
    
    const[words,updatedata] = useState([])
    const processSugesstion = () =>{
        let input = document.getElementById("input");
        let suggestion = document.getElementById("suggestion")
        
        input.onload = () => {
            input.value = ''
            clearSuggestion();
        }
        
        const clearSuggestion = () => {
            console.log('clearing suggestion')
            suggestion.innerHTML = "";
        };
        
                
        input.addEventListener("input", (e) => {
            clearSuggestion();
            let val = ''
            //Convert input value to regex since string.startsWith() is case sensitive
            if (input.value.includes(' ')){
                val = input.value.split(' ').pop()
            }
            else {
                val = input.value
            }
            let regex = new RegExp("^" + val, "i");
            console.log(words);
            for (let i in words) {
                //check if input matches with any word in words array
                if (regex.test(words[i]) && input.value != "") {
                
                    //Change case of word in words array according to user input
                    console.log(words[i])
                    
                    if (val===words[i]) { clearSuggestion(); }
                    
                    suggestion.innerHTML = words[i]
                    break;    
                    }
                
            }
        
        });
        input.addEventListener("keydown", (e) => {
            //When user presses enter and suggestion exists
            console.log(e.Key)
            if (e.key == 'Tab' && suggestion.innerHTML != "") {
                console.log('tabkey is pressed')
                e.preventDefault();
                if (!(input.value.includes(' '))){input.value = suggestion.innerHTML;}
                else {input.value = input.value.split(' ').slice(0,-1).join(' ')+' '+suggestion.innerHTML.trim();}
              //clear the suggestion
                clearSuggestion();
            }
        })
    }
    return (
        <div className="input-container">
            <input type="text" id="input" 
            placeholder="Type some Expression here.." 
            autoComplete="off" 
            onClick={function(){
                updatedata(opt.datalist);
                processSugesstion();
                }
                }
            />
            <textarea id="suggestion"></textarea>
        </div>
    )
} 

export  function Button(opt){

    return (
        <button onClick = {opt.function} id = {opt.id} href =' '>
            {opt.desc}
        </button> 
    )
}

export function Notes(opt){
    //props:{onclick,id,function,parentId,sidebarID}
    // const side = ReactDOM.createRoot(document.getElementById(opt.SidebarID))
    function closepop() {
        let input = document.getElementById(opt.ID)
        if (!(typeof opt.parentId === 'undefined')){
            let doc = document.getElementById(opt.parentId);
            doc.classList.remove('open-popup');
        }
    }    
    function closeNsubmit () {
        closepop()
        opt.onclick(); 
    }
    async function onEnter(){
        let text = document.getElementById('notestext')
        if (!(text.value === '')){ await opt.onclick()}
        text.value = ''
    }

    async function notesSidebar() {
        
        await side.render(<Sidebar parentID = {opt.SidebarID} /> )
        document.getElementById('sidebar').classList.add('open-sidebar')
    }
    return (
        <>
        <textarea name="notestext" id="notestext" onKeyDown={(event) =>{if (event.key ==='Enter' && !event.shiftKey) {event.preventDefault();onEnter()}}} ></textarea>
        <div className='NotesPopupBtn'>
            {/* <Button function = {notesSidebar} id = {opt.id} desc ='View History'/> */}
            <Button function = {closeNsubmit} id = {opt.id} desc ='➩'/>
        </div>
        </>
    )
}

