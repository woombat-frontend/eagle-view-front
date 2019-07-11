import React, { useContext, useEffect, useState } from 'react'
import '../Styles/Main.css'
import Context from '../GlobalState/context'
import { Route, Link, BrowserRouter } from 'react-router-dom'
import Mapper from './Mapper'
import Editable from './Editable'
import axios from 'axios';

const Main = () => {

    const { state, actions } = useContext(Context)
    const url = "https://woombat-rest-api.herokuapp.com/"
    const [finalData, setFinalData] = useState({})
    const urlDataPaths = ["ambientes", "conexiones", "fuentes", "campos", "config", "func"]
    
    useEffect(() => {
        urlDataPaths.map(urlPath => 
                axios.get(`${url}${urlPath}`)
                    .then(res => {
                        finalData[urlPath] = res.data;
                        setFinalData({ ...finalData })
                    })
        )
        actions({ type: "setState", payload: { ...state, currentRoute: "main", data: finalData } })
    }, [])

    return (
        state.currentRoute === "main" ? 
        <div class="main-container">
            <h2 className="welcome">Bienvenido a Eagle View</h2> 
            <button onClick={() => actions({type: "getState"})}>check</button>
        </div>
        :
        <div>
                <Route path="/dashboard" component={Mapper} />
                <Route path="/details" component={Editable} />

        </div>
    )
}

export default Main;