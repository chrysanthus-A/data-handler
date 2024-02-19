import React from 'react';
import ReactDOM from 'react-dom/client';
import {FileSelect} from '../components/inputs';
import {Datagrid} from '../components/grid';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import '../index.css';
const griddiv = ReactDOM.createRoot(document.getElementById('grid'));
const form = ReactDOM.createRoot(document.getElementById('form'));

// export function DataStart() {
//   console.log('hello form data start')
  form.render(
  <React.StrictMode>
    <div className='fileInput' id='fileInput'>
      <DndProvider backend={HTML5Backend}>
      <FileSelect />
      </DndProvider>
    </div>
  </React.StrictMode>);
// }

export function Displaygrid(){
  let dragspace = document.getElementById('fileInput')
  // let inputform = document.getElementById('form')
  dragspace.classList.add('fileinputSmall')
  griddiv.render(
      <div className='grid'>
      <Datagrid  pagesize = {30} />
      </div>
  );
  
  
}




