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
    const handleselect = async (e) => {
        let object={}
        let element=e.target
        const parent=(node) => {
            return (node.parentNode.parentNode.parentNode)
        }
        let p = parent(element)
        object.index = p.getAttribute('data-index')
        object.hierarchy_ID = p.getAttribute('data-hierarchyid')
        object.hierarchy = p.getAttribute('data-hierarchy')
        object.selectedID = p.getAttribute('data-selectedid')
        object.name = element.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
        object.type = p.id
        object.ws = p.getAttribute('data-ws')
        object.page = p.getAttribute('data-pg')
        object.project = p.getAttribute('data-pj')
        await updateSelection(object)
        console.log(object);  
        try {opt.control()}
        catch (e) {console.log('no Specific function specified');}  
        // if (e.ctrlKey){
        //     opt.control()
        // }
    }
    const renderTree = (nodes,index,type=opt.root,workspace=null,project=null,parentId='root') => {
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
            <div id = {type} data-index = {index} data-ws={workspace} data-pj={project} data-pg={page} data-hierarchy={nodes.hierarchy}  data-selectedid = {nodes.id} data-hierarchyid = {nodes.hierarchy_ID}>  
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>    
            {Array.isArray(nodes.children)
            ?nodes.children.map((node,c_index) => renderTree(node,`${String(index)}.${String(c_index)}`,next_type,workspace,project,nodes.id))   
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
        selected = {opt.selected}
        defaultExpandIcon={'+'}
        >
        
        {data.map((root,index)=><span>{renderTree(root,index)}</span>)}
        
        </TreeView>
    </Box>
);
}
export function getSelection(clear = null){
    if (clear)
        current_node = {}

    return current_node
}

