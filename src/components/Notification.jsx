import '@mantine/core/styles/global.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/Loader.css';
import { MantineProvider } from '@mantine/core';
import { Notification, rem } from '@mantine/core';


export function NotificationSystem(opt){
    let notification = document.getElementById(opt.canvas); 
    const closealert = () => {
        notification.style.visibility = 'hidden'
    }
    if (opt.state ==='saving'){
        notification.style.visibility = 'visible'
        return(<MantineProvider>
            <Notification loading={true} title = 'Saving in Progress' onClose={closealert}>Please Wait while the file is being saved</Notification>
            </MantineProvider>)
    }
    if (opt.state==='success') {
        const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
        notification.style.visibility = 'visible'
        // return(<Notification  title = 'File Saved' icon = {IconCheck} onClose={closealert}>File Saved Successfully</Notification>)
        
        return(<MantineProvider>
            <Notification  title = 'File Saved' icon ={checkIcon} onClose={closealert}>File Saved Successfully</Notification>
            </MantineProvider>)
    }
}