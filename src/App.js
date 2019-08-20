import React,{Component}from 'react'
import Login from './pages/login/Login'
import Admin from './pages/admin/Admin'
import {BrowserRouter,Route,Switch} from 'react-router-dom'


export default class App extends Component{
    render(){
        return(
            <BrowserRouter>
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/' component={Admin}/>
                    </Switch>
            </BrowserRouter>
        )
    }
}