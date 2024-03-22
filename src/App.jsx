import papaparse  from 'papaparse'
import largeJSON from 'lodash'
import {useRef} from 'react'

export let base =  'https://chrysrex.pythonanywhere.com/' //prod
// export let base =  'http://127.0.0.1:5000' //dev

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
export function clearChild(parent){
    let child =parent.lastElementChild;
    while (child){
        parent.removeChild(child)
        child = parent.lastElementChild
    }
}

const get_type = (content) =>{
    content =content.replace(/,/g, '')
    if (isNaN(content)||content==='') {return ('string')}
    else { return ('number')}

}

const obtainsampledata = (dataset)=>{
    let x = 0
    let sample = dataset[x]
    while ( x <= 10) {
    sample = dataset[x] 
    try{   
        if (!(sample.includes('') || sample.includes(' '))){
        return sample
        }
    }
    catch(e){console.log(e)}
    x+=1
    }
    return sample
}
export async function processImage(files){
    let file = files[0]
    var ext = file.name.split('.').pop()
    // console.log(file)
    var filepath = URL.createObjectURL(file)
    return filepath
}

export async function processfile(files) {
    // var csvfile = document.getElementById('csvfile')
    // var [file] = csvfile.files
    // let [file] = files
    let file = files[0]
    document.title = file.name
    var ext = file.name.split('.').pop()
    // console.log(file)
    var filepath = URL.createObjectURL(file)
    var gridfile = await fetch(filepath)
    var data = await gridfile.text() 
    return[data,ext]
}    
export async function processdata(data,ext) { 
    var columnDefs = []
    var rowData = []
    var headers = []
    var coldefs = {}
    var notesdict = {}  
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
            if (isNaN(element[key])|| element[key]==='') {var data =element[key]}
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
    // Displaygrid()

    return [rowData,columnDefs,coldefs,headers,notesdict]
    
} 

export function JSONObject(data,chunksize){
    const chunks = largeJSON.chunk(Object.entries(data), chunksize);
    return chunks.map((chunk) =>
    JSON.stringify(largeJSON.fromPairs(chunk))
    );
}
export function isEmpty(data){
    return largeJSON.isEmpty(data)
}

export function getId(name = 'None', size = 10) {
    // Combine name (without spaces), digits, and letters into a single string
    const chars = name.replace(/\s/g, '') + String.fromCharCode(...Array(10).fill(0).map((_, i) => i + 48)) + String.fromCharCode(...Array(26).fill(0).map((_, i) => i + 65).concat(Array(26).fill(0).map((_, i) => i + 97)));
    
    // Use Array.from() to create an array from the string
    const charArray = Array.from(chars);
    charArray.sort(() => 0.5 - Math.random())
    // Use Array.prototype.slice.call() to create a subarray of random characters
    return charArray.slice(0, size).join('');
}
