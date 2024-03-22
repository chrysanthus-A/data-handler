import React from 'react';
import ReactDOM from 'react-dom/client';
import {Datagrid} from '../components/grid';
import {FileSelect} from '../components/inputs';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { currentdata } from './workspaces';
import { processdata } from '../components/grid';
import { getData } from '../App';
import '../components/sidebar';


// import { MantineProvider } from '@mantine/core';
// import '@mantine/notifications/styles.css'
import '../index.css';

const grid = (document.createElement('div'));
grid.id = 'grid'
const griddiv = ReactDOM.createRoot(grid)
// const form = ReactDOM.createRoot(document.getElementById('form'));

// export function DataStart() {
//   console.log('hello form data start')

let pagedata = JSON.parse(window.sessionStorage.getItem('pagedata'));
console.log(pagedata);
document.title = pagedata.pg || pagedata.pj
const myoption = {method:'POST',body:JSON.stringify({workspace:pagedata.ws,project:pagedata.pj,page:pagedata.pg})}
let data = await getData('/open',myoption)
export function gethierarchy(){
  let object = {}
  object.ws = pagedata.ws
  object.pj = pagedata.pj
  object.pg = pagedata.pg
  return object
}
if (!data.defaultpage || data.defaultpage.content.length === 0){
  griddiv.render(
    <div className='fileInput' id='fileInput'>
      <DndProvider backend={HTML5Backend}>
      <FileSelect />
      </DndProvider>
    </div>
  );
  document.getElementById("mainContent").appendChild(grid)
}
else {
  griddiv.render(
    <div className='fileInput' id='fileInput'>
      <DndProvider backend={HTML5Backend}>
      <FileSelect  file = {JSON.stringify(data.defaultpage.content)}/>
      </DndProvider>
    </div>
  )
  // document.getElementById("mainContent").appendChild(grid)
  
}

export function Displaygrid(){
  try{
    let dragspace = document.getElementById('fileInput')
  // let inputform = document.getElementById('form')
    dragspace.classList.add('fileinputSmall')
  }
  catch{}
  griddiv.render(
      
      <div className='grid'>
      <Datagrid  pagesize = {30} /> 
      </div>
  );
  
  // rowData = {row} columnDefs = {col} headers = {head} notesdict = {notes}
  
}




