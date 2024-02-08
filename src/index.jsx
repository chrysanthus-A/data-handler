import React from 'react';
import ReactDOM from 'react-dom/client';
import {FileSelect} from './inputs';
import {Datagrid} from './grid';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './index.css';


const griddiv = ReactDOM.createRoot(document.getElementById('grid'));
const form = ReactDOM.createRoot(document.getElementById('form'));


form.render(
<React.StrictMode>
  <div className='fileInput' id='fileInput'>
    <DndProvider backend={HTML5Backend}>
    <FileSelect />
    </DndProvider>
  </div>
</React.StrictMode>);



export function Displaygrid(){
  let dragspace = document.getElementById('fileInput')
  // let inputform = document.getElementById('form')
  dragspace.classList.add('fileinputSmall')
  griddiv.render(
      <div className='grid'>
      <Datagrid  pagesize = {10} />
      </div>
  );
  
  
}




