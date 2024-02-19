import React ,{useEffect,useState} from 'react'
import ReactDOM from 'react-dom/client';
import eye from '../assets/eye.svg'

// props:{submitFunction}
export function Login (opt){
    //consts
    // const[Func,set_func] = useState(checkCredentials)
    const[login_label,set_loginLabel] = useState((opt.login_label === undefined)? 'Login':opt.login_label)
    const[create_label,set_createLabel] = useState((opt.create_label === undefined)? 'Create New Account':opt.create_label)
    const[alt_login,set_altLogin] = useState((opt.alt_login === undefined)? 'Create New Account?':opt.alt_login)
    const[alt_create,set_altCreate] = useState((opt.alt_create === undefined)? 'Login Using Existing Account':opt.alt_create)
    let base = opt.base



    async function checkCredentials(){
        const param = '/login'
        const username = document.getElementById('username')
        const password = document.getElementById('password')
        const status = document.getElementById('status')
        const apiOptions = {
            method : 'post' ,
            body : JSON.stringify({user:username.value,pwd:password.value}),

        }
        console.log(base+param)
        const req = new Request(base+param,apiOptions)
        let resp = (await fetch(req))
        resp = await resp.json()
        console.log(resp)
        status.innerHTML = resp.auth
        if (resp.code===200){
            let forward = document.createElement('a')
            forward.href=opt.on_success
            document.body.appendChild(forward)
            forward.click()
            forward.remove()
        }

    }
    async function createAccount(){
        const param = '/newuser'
        const username = document.getElementById('username')
        const password = document.getElementById('password')
        const status = document.getElementById('status')
        const apiOptions = {
            method : 'post' ,
            body : JSON.stringify({user:username.value,pwd:password.value}),

        }
        console.log(base+param)
        const req = new Request(base+param,apiOptions)
        let resp =await fetch(req)
        resp = await resp.json()
        status.innerHTML = resp.auth
        
    }
    async function switchmethod(){
        //DOMs
        const alt_option = document.getElementById('createlabel')
        const action = document.getElementById('action')
        const LoginBtn = document.getElementById('loginbutton')
        const RegisterBtn = document.getElementById('registerbutton')
        document.getElementById('username').value = ''
        document.getElementById('password').value = ''
        
        //action labels



        if (action.innerHTML === login_label){

            action.innerHTML = create_label
            alt_option.innerHTML = alt_create
            LoginBtn.style.display = 'none'
            RegisterBtn.style.display= 'block'

            }
        else if (action.innerHTML === create_label){

            action.innerHTML = login_label
            alt_option.innerHTML = alt_login
            LoginBtn.style.display = 'block'
            RegisterBtn.style.display= 'none'

            }

    }
    function showpwd(){
        const password = document.getElementById('password') 
        const eye = document.getElementById('eye') 
        if (password.type === "password") {
            eye.classList.add('eyeimg-pressed')
            password.type = "text";
        } else {
            eye.classList.remove('eyeimg-pressed')    
            password.type = "password";
            }
    }
    // (props)= login_label , create_label, alt_create , alt_login, on_success
    return (
        
            <div className="container">
                <h2 id='action'>{login_label}</h2>
                <form action="">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username" />
                    <label htmlFor="password">Password:</label>
                    <div id = 'pwd'>
                    <input type="password" id="password" name="password" placeholder="Enter your password" />
                    <img src={eye}className='eyeimg'id='eye' onClick={showpwd} alt='show password'></img>
                    </div>
                    <label htmlFor="status" id ='status'></label>
                    <div className='LoginBtnDiv'>
                    <button type="button" onClick={checkCredentials} id = 'loginbutton'>Login</button>
                    <button type="button" onClick={createAccount} id = 'registerbutton'>Register</button>
                    </div>
            
            <div className='OtherOptions'>
            <a href='' className="forgot-password">Forgot password?</a>
            <label href = ''className="New-account" onClick={switchmethod} id = 'createlabel'>{create_label}</label>
            </div>
            </form>
        </div>
    
    )
}