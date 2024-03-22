import React ,{useState,useCallback} from 'react'
import ReactDOM from 'react-dom/client'


export function Objects(opt){
    return (
        <>
        <div className='exitButton'>
            <button type = 'button' onClick={opt.close} className='end'>X</button>
        </div>
        <div id="object-IconContainer">
            <span>
            <button className="object-Icon glyphicon glyphicon-text-width" type="button" draggable= "true"  onDrag={opt.drag} data-obj = 'text'><span className="sr-only">text</span></button>
            <button className="object-Icon glyphicon glyphicon-picture"  type="button" draggable= "true"  onDrag={opt.drag} data-obj = 'picture'><span className="sr-only">picture</span></button>
            <button className="object-Icon glyphicon glyphicon-list-alt" type="button" draggable= "true"  onDrag={opt.drag} data-obj = 'grid'><span className="sr-only">table</span></button>
            </span>
        </div>
        </>
    )
}