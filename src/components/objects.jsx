import React ,{useState,useCallback, useEffect} from 'react'
import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider,Image } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

let files;

export function getFile(){return files}
export function FileInput(opt){
    const [file,updateFile]= useState(false)

    useEffect(() =>{
        files = file    
    },[file])
    const onAccept= async (blob)=>{
        await updateFile(blob)
        opt.carryon(blob)
    }
    return (
        <MantineProvider>
        <Dropzone
            onDrop={async (blob)=>await onAccept(blob)}
            // maxSize={5 * 1024 ** 2}
            accept={opt.accept}
            // {...props}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                    stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                    />
                </Dropzone.Idle>
        
                <div>
                <Text size="xl" inline>
                    {opt.message}
                </Text>
                </div>
            </Group>
            </Dropzone>
            </MantineProvider>
    )
}
export function FileImage(opt){

    return (<MantineProvider>
            <Image
            radius="md"
            src={opt.source}
            h='100%'
            w='100%'
            className='resizable'
            draggable={false}
            />
            </MantineProvider>
            );
    
}
export function TextEdit(opt){
    const content = opt.content;
    const editor = useEditor({
        extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content
    });
    const onclick=(event)=>{
        // opt.close()
        opt.styles(event,editor)
    }
    return (<MantineProvider>
            <RichTextEditor editor={editor} h = '100%' w = '100%' className='resizable' draggable= {false} onClick ={onclick}>
            <RichTextEditor.Content />
        </RichTextEditor>
        </MantineProvider>
        );


}


export function Styles(opt){


    return (<>
        <div className='exitButton'>
            <button type = 'button' onClick={opt.close} className='end'>X</button>
        </div>
        <MantineProvider>
        <RichTextEditor editor={opt.editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={160}>
        <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        {/* <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup> */}

        <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        </RichTextEditor>
        </MantineProvider>
        </>
    )
}