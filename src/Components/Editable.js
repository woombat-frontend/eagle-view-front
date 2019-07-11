import React, { useContext, useEffect, useState } from 'react'
import Context from '../GlobalState/context';
import { Button, Input, Icon } from 'antd'
import '../Styles/Editable.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom'



const Editable = props => {
    const { state, actions } = useContext(Context)
    const [localData, setLocalData] = useState({})
    const [type, setType] = useState("")
    const [keys, setKeys] = useState([])
    const [finalData, setFinalData] = useState({})
    let inputKeys = []
    const [filterText, setFilterText] = useState("")
    const { Search } = Input
    const url = "https://woombat-rest-api.herokuapp.com/"

    useEffect(() => {
        setLocalData(state.singleJson.data);
        setType(state.singleJson.type);
        setKeys(Object.keys(state.singleJson.data))
    }, [])

    const postData = () => {
        let translated = ""
        let idName = ""
        type === "env" ? translated = "ambientes/" : type === "conections" ? translated = "conexiones/" : type === "sources" ? translated = "fuentes/" : type === "fields" ? translated = "campos/" : translated = null
        translated === "ambientes/" ?
            makeRequest(translated)
            :
            translated === "conexiones/" ?
                makeRequest(translated)
            :
                translated === "fuentes/" ?
                    makeRequest(translated)
            :
                        translated === "campos/" ?
                            makeRequest(translated)
            : console.log("Error")
    }

    const makeRequest = (endpoint) => {
        //axios.delete(`${url}${endpoint}?${id}=${localData.id_environment}`)
        axios.patch(`${url}${endpoint}${localData.id}`, localData)

            .then(() => updateData())
            .catch(error => console.log("Hubo un error: ", error))
    }

    const updateData = () => {
        const urlDataPaths = ["ambientes", "conexiones", "fuentes", "campos", "config", "func"]
        urlDataPaths.map(urlPath =>
            axios.get(`${url}${urlPath}`)
                .then(res => {
                    finalData[urlPath] = res.data;
                    setFinalData({ ...finalData })
                })
        )
        actions({ type: "setState", payload: { ...state, currentRoute: "main", data: finalData } })
    }

    const backToDashboard = () => {
        props.history.push("/dashboard")
    }

    return (
        <div className="details-container">
            <div className="details-header">
                <Search
                    placeholder="Filtrar Configuración"
                    className="search-box"
                    onChange={e => setFilterText(e.target.value)}
                />

                <Button onClick={postData} className="save-btn" type="primary">
                    <Icon type="save" />
                    Guardar
                </Button>

                <Button onClick={backToDashboard} className="back-btn" type="primary">
                    <Icon type="left-square" />
                    Volver
                </Button>
            </div>
            <section className="rendered-data">
                {/* <Button style={{ position: "absolute", top: "10%", left: "4%" }} onClick={() => console.log(inputKeys)} type="primary"> Check Local Data</Button>
                <Button style={{ position: "absolute", top: "15%", left: "4%" }} onClick={() => console.log(keys)} type="primary"> Send Request</Button> */}



                {
                    filterText.length === 0 ?
                        Object.keys(localData).map((x, i) =>
                            i === 0 ?
                                <div key={x} className="single-input">
                                    <p className="item-title"> {x} </p>
                                    <Input
                                        value={localData[x]}
                                        disabled={true}
                                    />
                                </div>
                                :
                                <div key={x} className="single-input">
                                    <p className="item-title"> {x} </p>
                                    <Input
                                        value={localData[x]}
                                        onChange={e => setLocalData({ ...localData, [x]: e.target.value })}
                                    />
                                </div>
                        )
                        :
                        keys.filter(x => x.includes(filterText)).map((x, i) =>
                            x === "id" ?
                                <div key={x} className="single-input">
                                    <p className="item-title"> {x} </p>
                                    <Input
                                        value={localData[x]}
                                        disabled={true}
                                    />
                                </div>
                                :
                                <div key={x} className="single-input">
                                    <p className="item-title"> {x} </p>
                                    <Input
                                        value={localData[x]}
                                        onChange={e => setLocalData({ ...localData, [x]: e.target.value })}
                                    />
                                </div>
                        )
                }<br /><br />
            </section>
        </div>
    )


}

export default withRouter(Editable)