import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import {Button,Input,AddcolPopup,Notes} from './inputs.jsx'
import { Sidebar } from './sidebar.jsx';
import { DataGridPremium ,
    GridToolbarContainer,
    GridToolbar,useGridApiContext,useGridApiEventHandler,
    DEFAULT_GRID_AUTOSIZE_OPTIONS
    } from '@mui/x-data-grid-premium';
import {base,JSONObject} from '../App.jsx'
import { NotificationSystem } from './Notification.jsx';

// globalvars
// let baseURL = 'https://chrysrex.pythonanywhere.com/'
let baseURL = base
var columnDefs = []
var rowData = []
var headers = []
var coldefs = {}
var notesdict = {}
let nos_cols = 0
// global div elements/react roots

const side = ReactDOM.createRoot(document.getElementById('sidebar'))
const pop = ReactDOM.createRoot(document.getElementById('popup'));
let head_list  = document.getElementById('headerslist')
let notes_div = document.getElementById('notes')
let notes = ReactDOM.createRoot(notes_div)


// API requests
const time_reqOptions = {
    method : 'GET',
}
const time_req = new Request(baseURL+'/time',time_reqOptions)


// fUnctions




export function Datagrid(opt) {

    let [rows,update_rows] = useState(opt.rowData)
    let [cols,update_cols] = useState(opt.columnDefs)
    let [header,update_header] = useState(opt.headers)
    let [notesdef,update_notes] = useState(opt.notesdict)
    let [coldefs,update_form] = useState(opt.formulas)
    
    const [cell_data, Set_cellData] = useState(' ')
    const [cell_field,Set_cellfield] = useState(' ')
    const [cell_id,Set_cellID] = useState(' ')
    const [row_ids,update_ids] = useState([])

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
    
    const handleRowClick = (params,event)=>{
        // console.log(params)
        update_ids(params)
        
    }

    const handleCellClick = async (params,event) =>{
        const recordnotes=async () => {
            if (notesdef[params.field][params.id] === undefined){
                notesdef[params.field][params.id] = []
            }
            let cur_time = await fetch(time_req,time_reqOptions)
            let data = await cur_time.json()
            notesdef[params.field][params.id].push(`${notes_value.value};;;${data["date"]};;;${data["time"]}`)
            update_notes(Object.fromEntries(Object.entries(notesdef).slice(0)))
            handleCellClick(params,event='')
            // document.getElementById('sidebar').classList.remove('open-sidebar')
            }

        await side.render(<Sidebar parentID = 'sidebar' record = {recordnotes} notes = {notesdef} cell_field={params.field} cell_id = {params.id} /> )
        let notes_value = document.getElementById('notestext')
        notes_div.style.visibility = 'hidden'
        Set_cellfield(params.field)
        Set_cellID(params.id)
        
        if (coldefs[params.field] ===''){
            Set_cellData(params.value)
        }
        else {
            Set_cellData(coldefs[params.field])
        }
        if (!(event ==='')){
            document.getElementById('sidebar').classList.remove('open-sidebar') 
        }
        if (event.ctrlKey){
            var left = String(document.documentElement.scrollLeft+event.clientX) + 'px'
            var top = String(document.documentElement.scrollTop+event.clientY) + 'px'
            notes_div.style.visibility = 'visible'
            notes_div.style.left = left
            notes_div.style.top = top
            notes.render(<Button function = {displaynotes} id='notesbutton' desc = '+'/>)
        }   

        async function displaynotes() {
            notes_div.style.visibility = 'hidden'
            try{            
                notes_value.value = ''
            }
            catch(e){console.log(e)}
            document.getElementById('sidebar').classList.add('open-sidebar')
        }
    }    

    function CustomToolbar() {
        const Apiref = useGridApiContext()
        useGridApiEventHandler(Apiref, 'rowSelectionChange', handleRowClick)
        return (
            <GridToolbarContainer>
                <GridToolbar />
                <Button desc = 'AUTOFIT' function={() => Apiref.current.autosizeColumns(autosizeOptions)} />
                <Button desc = 'ADD COLUMNS' function = {AddCol} />
                <Button desc = 'DELETE ROW' function = {()=>{row_ids.forEach(rid =>{Apiref.current.updateRows([{ id: rid, _action: 'delete' }])}) }} />
                <Button desc ='SAVE' function = {saveasJSON} id='download' />
                <Input ID = 'Formula' width = 'fit-content' height = '25px' margin = '5px' fsize = '18px' value = {cell_data}/>
                <Button desc = 'EDIT FORMULA' function = {Editcell}/>
                <Button desc = "DEV" function = {details}/>
            </GridToolbarContainer>
        );

        function details(){
            console.log('coldata' ,Apiref.current.getAllColumns())
            let rows = Apiref.current.getRowModels()
            console.log('rowmodel',[...rows.values()])
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
            opt.notify.render(<NotificationSystem state={'saving'} canvas ={'Notification'} />)
            let hier = opt.page
            let rowdef = Apiref.current.getRowModels()
            rowdef = [...rowdef.values()]
            // let coldef = Apiref.current.getDataAsCsv() 
            let colformat = Apiref.current.getAllColumns()
            var head = Object.keys(rowdef[0])
            let savedJson = {coldef : head , rows : rowdef ,formula : coldefs , colformat :colformat ,notes:notesdef}
            let data = {data:savedJson,workspace:hier.ws,project:hier.pj,page:hier.pg||null}
            opt.save(data,opt.ID)
            opt.notify.render(<NotificationSystem state={'success'} canvas ={'Notification'} />)
            
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
        let val_str='' ;
        let opr = ['+','-','*','/']
        if (val ===''){val_str = ' ';}
        else if (val.includes('/js/')){val_str = val.split('/js/')[1]}
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
    
    return (
        <Box sx={{ height: '100%', width: '100%' , zIndex : 0 , border:1,}}>
        <DataGridPremium 
            rowHeight={25}
            columnHeaderHeight={40}
            onCellClick={handleCellClick}
            showColumnVerticalBorder
            showCellVerticalBorder
            experimentalFeatures={{ ariaV7: true,lazyLoading: true }}
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
            pageSizeOptions={[opt.pagesize/2,opt.pagesize/1.5,opt.pagesize,opt.pagesize*1.5,opt.pagesize*2 ]}
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
