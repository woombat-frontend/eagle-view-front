// Import de dependencias
import React from 'react'
import ReactDOM from 'react-dom'
import Context from './GlobalState/context'
import useGlobalState from './GlobalState/useGlobalState'
import { Route, Link, BrowserRouter } from 'react-router-dom'


//Import de Componentes y estilos
import Main from './Components/Main'
import Navbar from './Components/Navbar'
import './Styles/Index.css'
import "antd/dist/antd.css"


const Index = () => {
    const store = useGlobalState();
    return (
      <BrowserRouter>
        <Context.Provider value={store}>
          <div className="main-layout">
            <Navbar />
            <Main />
          </div>
        </Context.Provider>
      </BrowserRouter>
    )
};


ReactDOM.render(<Index />, document.getElementById("root"))
