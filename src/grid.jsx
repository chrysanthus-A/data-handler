import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import {Button,Input,AddcolPopup,Notes} from './inputs.jsx'
import { Sidebar } from './sidebar.jsx';
import { DataGridPremium ,
    GridToolbarContainer,
    GridToolbar,useGridApiContext,
    DEFAULT_GRID_AUTOSIZE_OPTIONS
    } from '@mui/x-data-grid-premium';
import { borders } from '@mui/system';
import {Displaygrid} from './index.jsx'
import papaparse  from 'papaparse'
import './App.css'

// globalvars
let baseURL = 'https://chrysrex.pythonanywhere.com/'
var columnDefs = []
var rowData = []
var headers = []
var coldefs = {}
let notesdict = {}

// global div elements/react roots

const side = ReactDOM.createRoot(document.getElementById('sidebar'))
const pop = ReactDOM.createRoot(document.getElementById('popup'));
let head_list  = document.getElementById('headerslist')
let notes_div = document.getElementById('notes')
let notes = ReactDOM.createRoot(notes_div)
let nos_cols = 0

// API requests
const time_reqOptions = {
    method : 'GET',
    'Access-Control-Allow-Origin' : '*'
}
const time_req = new Request(baseURL+'/time',time_reqOptions)


// fUnctions
const get_type = (content) =>{
    content =content.replace(/,/g, '')
    if (isNaN(content)) {return ('string')}
    else { return ('number')}

}
const obtainsampledata = (dataset)=>{
    let x = 0
    while ( x <= dataset.length) {
    let sample = dataset[x]    
    if (!(sample.includes('') || sample.includes(' '))){
        return sample
        }
    x+=1
    }
}
export async function processdata(data,ext) {   
    if (!(ext ==='json')){
    // console.log(csvtext)
    var data =  await papaparse.parse(data)
    var griddata = [data['data']][0]
    headers  = griddata[0]
    var actual_data= griddata.slice(1)
    let x =0
    let sampledata = obtainsampledata(actual_data)
    var new_headers = []
    headers.forEach(element => {
        let headname =element
        let len = element.split(' ').length
        if (len>1){
            headname = element.split(' ').join('_')
        }
        columnDefs.push({headerName:headname ,field: headname, minWidth : null, editable : true,type : get_type(sampledata[headers.indexOf(element)]), headerClassName : 'grid-header'})
        coldefs[headname] = '' 
        new_headers.push(headname)
        notesdict[headname]={}   
    });
    headers = new_headers

    
    var rowID = 1
    actual_data.forEach(element => {
        var keys = element.keys()
        var datadict = { id : rowID}
        rowID +=1
        for (let key of keys){
            if (isNaN(element[key])) {var data =element[key]}
            else {var data = Number(element[key])}

            datadict[headers[key]] = data   ; 
        };
        rowData.push(datadict)
    })}
    else if (ext==='json'){
        data = await JSON.parse(data)
        columnDefs = data['colformat']
        columnDefs.forEach(element =>{
            element['maxWidth'] = Infinity
            element['minWidth'] = null
        })
        console.log(data['colformat'])
        rowData = data['rows']
        coldefs = data['formula']
        headers = data['coldef']
        notesdict = data['notes'] 
        // console.log(rowData,columnDefs,data['formula'])
    }
    else {console.log('file not supported')}
    // console.log(columnDefs)
    Displaygrid()
    
} 




export function Datagrid(opt) {

    let [rows,update_rows] = useState(rowData)
    let [cols,update_cols] = useState(columnDefs)
    let [header,update_header] = useState(headers)
    let [notesdef,update_notes] = useState(notesdict)
    
    const [cell_data, Set_cellData] = useState(' ')
    const [cell_field,Set_cellfield] = useState(' ')
    const [cell_id,Set_cellID] = useState(' ')

    useEffect(()=>{
        console.log('headercount',nos_cols)
        header.slice(nos_cols).forEach(element =>{
            let option = document.createElement('option')
            option.value = element
            head_list.appendChild(option)
            })
        nos_cols = header.length
        head_list.id = 'headerslist'    
        document.body.appendChild(head_list)
        
        
    },[header])


    const [includeHeaders, setIncludeHeaders] = React.useState(
        DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders,
        );
    const [includeOutliers, setExcludeOutliers] = React.useState(
        DEFAULT_GRID_AUTOSIZE_OPTIONS.includeOutliers,
        );
    const [outliersFactor, setOutliersFactor] = React.useState(
        String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor),
        );
    const [expand, setExpand] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
    
    function clearChild(parent){
        let child =parent.lastElementChild;
        while (child){
            parent.removeChild(child)
            child = parent.lastElementChild
        }
    }
    const handleCellClick = (params,event) =>{
        
        notes_div.style.visibility = 'hidden'
        Set_cellfield(params.field)
        Set_cellID(params.id)
        
        if (coldefs[params.field] ===''){
            Set_cellData(params.value)
        }
        else {
            Set_cellData(coldefs[params.field])
        }
        
        if (event.ctrlKey){
            var left = String(event.clientX) + 'px'
            var top = String(event.clientY) + 'px'
            notes_div.style.visibility = 'visible'
            notes_div.style.left = left
            notes_div.style.top = top
            notes.render(<Button function = {displaynotes} id='notesbutton' desc = '+'/>)
            console.log('notes triigeres')
        }   

        async function displaynotes() {
            notes_div.style.visibility = 'hidden'
            let notes_length = '9'
            const recordnotes=async () => {
                        if (notesdef[params.field][params.id] === undefined){
                            console.log('redefining')
                            notesdef[params.field][params.id] = []
                        }
                        let cur_time = await fetch(time_req,time_reqOptions)
                        let data = await cur_time.json()
                        console.log(data)
                        notesdef[params.field][params.id].push(`${notes_value.value};;;${data["date"]};;;${data["time"]}`)
                        update_notes(Object.fromEntries(Object.entries(notesdef).slice(0)))
                        console.log('noted')
                        document.getElementById('sidebar').classList.remove('open-sidebar')
                        // new_notes.unmount()
                        }
                        

            await side.render(<Sidebar parentID = 'sidebar' record = {recordnotes} /> )
            let notes_value = document.getElementById('notestext')
            notes_value.value = ''
            const notesdiv = document.getElementById('notessection')
            clearChild(notesdiv)
            console.log('notesdef',notesdef)
            // new_notes= ReactDOM.createRoot(document.getElementById('new_notes'))
            if (Object.keys(notesdef[params.field]).includes(String(params.id))){
                console.log('notesfound',notesdef[params.field][params.id])
                
                let usernotes_full = JSON.parse(JSON.stringify(notesdef[params.field][params.id]))
                console.log(usernotes_full)
                let i = notes_length
                let notecount = 0
                usernotes_full.reverse()
                let usernotes = usernotes_full.slice(0,notes_length)
                let len = usernotes.length
                console.log(usernotes)
                let div = document.createElement('div')
                let text = document.createElement('textarea')
                let value =''
                while(i>0 && len>notecount){
                    console.log('condition',(i>0 && usernotes.length>notecount))
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
                text.setAttribute('TextMode','MultiLine') //TextMode="MultiLine"
                text.setAttribute('style','this.style.height = "";this.style.height = this.scrollHeight + "px"') //TextMode="MultiLine"
                div.appendChild(text)
                // div.appendChild(datetime)
                notesdiv.appendChild(div)
            }
            
            
            // new_notes.render(<Notes parentId ='popup' id = 'notespopup' onclick = {recordnotes} SidebarID = 'sidebar' />)
            
            document.getElementById('sidebar').classList.add('open-sidebar')

        }
        

    
        // async function displaynotes() {
            
        //     const recordnotes=() => {
        //         notesdef[params.field][params.id]=notes_value.value
        //         update_notes(Object.fromEntries(Object.entries(notesdef).slice(0)))
        //     }
        //     await pop.render(<Notes parentId ='popup' id = 'notespopup' onclick = {recordnotes} SidebarID = 'sidebar' />)
        //     let notes_value = document.getElementById('Notes')
            
        //     if (Object.keys(notesdef[params.field]).includes(String(params.id))){
        //         notes_value.value = notesdef[params.field][params.id]
        //     }
        //     else {notes_value.value = ''}
            
        //     notes_div.style.visibility = 'hidden'
            
        //     let notespopup = document.getElementById('popup')
        //     notespopup.classList.add('open-popup')
        // }
    }    

    function CustomToolbar() {
        const Apiref = useGridApiContext()
        return (
            <GridToolbarContainer>
                <GridToolbar />
                <Button desc = 'AUTOFIT' function={() => Apiref.current.autosizeColumns(autosizeOptions)} />
                <Button desc = 'ADD COLUMNS' function = {AddCol} />
                <Button desc ='SAVE' function = {saveasJSON} id='download' />
                <Input ID = 'Formula' width = 'fit-content' height = '25px' margin = '5px' fsize = '18px' value = {cell_data}/>
                <Button desc = 'EDIT FORMULA' function = {Editcell}/>
                <Button desc = "DEV" function = {details}/>
            </GridToolbarContainer>
        );
        function details(){
            console.log('coldata' ,Apiref.current.getAllColumns())
            console.log('rowmodel',Apiref.current.getRowModels())
            console.log('notes',notesdef)


        }
        async function Editcell(){
            await pop.render(<AddcolPopup  
                ID='editcol'
                label = 'Column Header Name' 
                parentId ='popup' 
                onclick ={recalculate} 
                headers={header} 
                grid ={cell_data}  
                />);
            let edit_inp = document.getElementById('editcol')
            let getcol=document.getElementById('popup')
            let formulabar = document.getElementById('input')
            edit_inp.value = cell_field
            edit_inp.setAttribute('list','headerslist')

            edit_inp.addEventListener("change",(e) => {
                console.log('change Detected')
                console.log(edit_inp.value)
                formulabar.value = coldefs[edit_inp.value]
                })
            Set_cellfield('')
            getcol.classList.add('open-popup')
            
            function recalculate () {
                // console.log(formula)
                let formula = parseForlumaString(formulabar.value);
                if ((formula === coldefs[edit_inp.value]) || (formula ===' ')) {
                    return 
                }
                coldefs[edit_inp.value] = formulabar.value
                rows.forEach(element => {
                    try { element[edit_inp.value] = eval(formula) }
                    catch(err){ console.log('some error for future problems',err)}
                    });
                update_rows(rows.slice(0))

            }
        
        
        
        }

        async function saveasJSON(){
            let rowdef = Apiref.current.getRowModels()
            rowdef = [...rowdef.values()]
            // let coldef = Apiref.current.getDataAsCsv() 
            let colformat = Apiref.current.getAllColumns()
            var head = Object.keys(rowdef[0])
            let savedJson = {coldef : head , rows : rowdef ,formula : coldefs , colformat :colformat ,notes:notesdef}
            let filename = document.title.split('.').slice(0,document.title.split('.').length -1) + '.json'
            let param = '/save'
            let myOptions = {
                method : 'POST',
                body : JSON.stringify({data:savedJson,file:filename}),
                'Access-Control-Allow-Origin': '*',
            }
            let req = new Request(baseURL+param,myOptions)  
            const response = await fetch(req)
            console.log(response)  
            // download(savedJson,filename)
            // console.log(colformat)
        }
        function download(data,file,type = 'text/plain'){

            var data_blob = new Blob([JSON.stringify(data)] ,{type:type})
            var a = document.createElement('a') 
            a.href = URL.createObjectURL(data_blob)
            a.setAttribute('download', file)
            document.body.appendChild(a)
            a.click()
            a.remove()               
        }
    } 
    async function AddCol(){
        await pop.render(<AddcolPopup  
            ID='addcol'
            label = 'Column Header Name' 
            parentId ='popup' 
            onclick ={getcoldef} 
            headers={header} 
            grid ={cell_data}  
            />);
        let inp = document.getElementById('addcol')
        if (!(inp.value === '')){
            inp.value = ' '
        }    
        let getcol=document.getElementById('popup')
        // console.log(getcol.classList)
        getcol.classList.add('open-popup')
    }
    function parseForlumaString(formula){
        let val = formula
        let val_str = ''
        let opr = ['+','-','*','/']
        if (val ===''){val_str = ' ';}
        else if(header.some(ele =>val.includes(ele))) {
            let val_arr = val.split(' ')
            // console.log(val_arr)
            val_arr.forEach(focus =>{
                if (Object.keys(coldefs).includes(focus)){ val_str += 'element["'+focus+'"]'}
                else if( opr.includes(focus)){val_str += (focus)}
                else if (!isNaN(focus)){val_str+=focus}
                });
            }
            return (val_str)
    }
    function getcoldef(){
        console.dir(coldefs)
        let inp = document.getElementById('addcol')
        let formula = document.getElementById('input')
        var col_name = inp.value.trim().split(' ').join('_')
        let val = formula.value.trim()
        coldefs[col_name] = val
        notesdef[col_name] = {}
        update_notes(Object.fromEntries(Object.entries(notesdef).slice(0)))
        var n_col = {headerName:col_name , field : col_name, editable : true, minWidth:null, headerClassName : 'grid-header'}
        let val_str = parseForlumaString(val)
        console.log(val_str)
        rows.forEach(element => {
            try {
                element[col_name] = eval(val_str)
            }
            catch(err){
                console.log('some error for future problems')
            }
            
            });
        // console.log('out of loop')
        cols.push(n_col)
        header.push(col_name)
        update_rows(rows.slice(0))
        update_cols(cols.slice(0))
        update_header(header.slice(0))
    }
    // function SaveasJSON(){
    //     console.log('saving logic goes here');
    //     GridApi.exportDataAsCsv()
    // } 
    const autosizeOptions = {
        includeHeaders:true,
        includeOutliers:false,
        // outliersFactor: Number.isNaN(parseFloat(outliersFactor))? 1 : parseFloat(outliersFactor),
        // expand,
    }; 
    const generateAggregationModel =(head,f={})=>{
        // let func = ['sum','avg','max','min','size']
        let func = 'sum'
        head.forEach(element =>{
            f[element] = func
        })
        return f
    }
    // console.log((Object.keys(notesdef['0']).includes(String(5))) ?  'noted' : ' sqd')
    return (
        <Box sx={{ height: '95%', width: 'fit-content' , zIndex : 0 , border:1,}}>
        <DataGridPremium 
            rowHeight={25}
            onCellClick={handleCellClick}
            showColumnVerticalBorder
            showCellVerticalBorder
            experimentalFeatures={{ ariaV7: true }}
            rows={rows}
            columns={cols}
            initialState={{
            pagination: {
                paginationModel: {
                    pageSize: opt.pagesize,
                    },
            rowGrouping: {
                    model: {header}
                    }
                },
            
            }}
            pagination
            pageSizeOptions={[opt.pagesize/2,opt.pagesize,opt.pagesize*1.5,opt.pagesize*2,opt.pagesize*2.5 ]}
            checkboxSelection
            disableRowSelectionOnClick
            getCellClassName={(params)=>{
                if (Object.keys(notesdef).includes(String(params.field))) {
                    return (Object.keys(notesdef[params.field]).includes(String(params.id))) && !(notesdef[params.field][params.id] === '') ?  'noted' : ''  
                    } 
                }}
            autosizeOptions={autosizeOptions}
            slots={{
                toolbar: CustomToolbar,
            }}
        />
        </Box>
    );
}