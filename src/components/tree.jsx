import React ,{useEffect,useState} from 'react'
// import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// props opt.data = dict/object
let current_node = {};
export  function Treeview(opt){
    const[selected,updateSelection] = useState({})

    useEffect(() =>{
            current_node = selected;
        },[selected])

    let data = opt.data
    const handleselect = (e) => {
        let object={}
        let element=e.target
        const parent=(node) => {
            return (node.parentNode.parentNode.parentNode)
        }
        let p = parent(element)
        object.hierarchy_ID = p.getAttribute('data-hierarchyID')
        object.hierarchy = p.getAttribute('data-hierarchy')
        object.name = element.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
        object.type = p.id
        object.ws = p.getAttribute('data-ws')
        object.page = p.getAttribute('data-pg')
        object.project = p.getAttribute('data-pj')
        updateSelection(object)
    }
    const renderTree = (nodes,type=opt.root,workspace=null,project=null,parentId='root') => {
        let next_type;
        let page=null;
        if (type==='Workspaces'){
            next_type = 'Projects'
            workspace = nodes.name
        }
        else if (type==='Projects'){
            next_type = 'Pages'
            project= nodes.name
        }
        else{page = nodes.name}
        // parentId ==='root'? parentId = nodes.id : null
        // using style for workpace and class for project name for div attributes 
        const t =(
            <div id = {type} data-ws={workspace} data-pj={project} data-pg={page} data-hierarchy={nodes.hierarchy} data-hierarchyID = {nodes.hierarchy_ID}>  
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>    
            {Array.isArray(nodes.children)
            ?nodes.children.map((node) => renderTree(node,next_type,workspace,project,nodes.id))   
            : null}
        </TreeItem>
        </div>)
        return t
    }
    
    return(
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
        <TreeView
        onNodeSelect={handleselect}
        aria-label="rich object"
        defaultCollapseIcon={'-'}
        defaultExpanded={opt.default}
        defaultExpandIcon={'+'}
        >
        
        {data.map((root)=><span>{renderTree(root)}</span>)}
        
        </TreeView>
    </Box>
);
}
export function getSelection(){return current_node}

