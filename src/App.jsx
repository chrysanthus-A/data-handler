

export let base =  'https://chrysrex.pythonanywhere.com/'
// let current_data = {}
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
