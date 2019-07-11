import React, { useContext } from 'react'
import { Icon } from 'antd'
import '../Styles/Navbar.css'
import { withRouter } from 'react-router-dom'
import Context from '../GlobalState/context';

const Navbar = props => {
    const { state, actions } = useContext(Context)
    const menuItems = [
        { name: "Crear", icon: "plus"},
        { name: "Dashboard", icon: "bars"},
        { name: "Configuraciones", icon: "setting"},
        { name: "Funciones", icon: "block"}
    ]

    const changeRoute = path => {
        actions({ type: "setState", payload: {...state, currentRoute: path.toLowerCase()}})
        props.history.push("/" + path.toLowerCase())
    }

    return (
        <div className="navbar-containeer">
            <ul className="menu-container">
                <h3 className="title">Eagle View</h3>
                { menuItems.map(x => 
                    <div key={x.name} onClick={() => changeRoute(x.name)} key={x.name} className="menu-item-container">
                        <Icon type={x.icon} className="icon" />
                        <li className="menu-item"> {x.name} </li>
                    </div>   
                )}
            </ul>
        </div>
    )
}

export default withRouter(Navbar)