import React, { useContext, useEffect, useState } from 'react'
import Context from '../GlobalState/context';
import '../Styles/Dashboard.css'
import axios from 'axios'
import { Icon, Button, Input } from 'antd'
import { withRouter } from 'react-router-dom'



const Mapper = props => {
    const { state, actions } = useContext(Context)
    const [localData, setLocalData] = useState([])
    const [env, setEnv] = useState([])
    const [lastParam] = useState([])
    const [show, setShow] = useState(false)
    const [path] = useState([])
    const { Search } = Input;
    const [filterText, setFilterText] = useState("")

    const [config, setConfig] = useState({
        currentType: "env",
        canBack: false,
        nameIndex: 1,
        pathName: ""
    })

    useEffect(() => {
        axios.get("https://woombat-rest-api.herokuapp.com/ambientes")
        .then(res => {
            setEnv(res.data)
            setLocalData(res.data)
            setShow(true)
        })
    }, [])
    
    const filterData = param => { 
        console.log("%c Param: " + param, "color: green; font-weight: bolder")
        switch (config.currentType) {
            case "env": {
                lastParam[0] = param
                path[0] = state.data.ambientes.filter(x => x.id === param)[0].landing_zone
                setLocalData([])
                setLocalData(state.data.conexiones.filter(x => x.environment_id_environment === param))
                setConfig({...config, currentType: "conections", canBack: true, pathName: path[0]})          
            }break;
            case "conections": {
                lastParam[1] = param
                path[1] = state.data.conexiones.filter(x => x.id === param)[0].connection_name
                setLocalData([])
                setLocalData(state.data.fuentes.filter(x => x.connection_id_connection === param))
                setConfig({ ...config, currentType: "sources", pathName: `${path[0]}/${path[1]}`})
            }break;
            case "sources": {
                lastParam[2] = param
                path[2] = state.data.fuentes.filter(x => x.id === param)[0].table_name
                setLocalData([])
                setLocalData(state.data.campos.filter(x => x.source_connection_id_connection === param))
                setConfig({ ...config, currentType: "fields", pathName: `${path[0]}/${path[1]}/${path[2]}`})
                
            } break;
            default: return 0;
        }
        //console.log(state.data.conexiones.filter(x => x.environment_id_environment === param))
    }   
    

    const back = () => {
        switch (config.currentType) {
            case "conections": {
                setLocalData(env)
                setConfig({...config, currentType: "env", canBack: false})
            }break;
            case "sources": {
                config.currentType = "env"
                filterData(lastParam[0])
            }break;
            case "fields": {
                config.currentType = "conections"
                filterData(lastParam[1])
            } break;
        }
    }

    const checkDetails = (param) => {

        let singleItem = {}
        switch (config.currentType) {
            case "env": 
                singleItem = state.data.ambientes.filter(x => x.id === param)[0]
            break;

            case "conections": 
                singleItem = state.data.conexiones.filter(x => x.id === param)[0]
            break;

            case "sources": 
                singleItem = state.data.fuentes.filter(x => x.id === param)[0]
            break;

            case "fields": 
                singleItem = state.data.campos.filter(x => x.id === param)[0]
            break;
        }
        actions({ type: "setState", payload: { ...state, singleJson: { type: config.currentType, data: singleItem} } })
        props.history.push("/details")
    }       


    return (
        show ? 
            <div className="mapper-container">
                {/* <button onClick={() => console.log(config.currentType)}>click</button> */}
                {
                    config.currentType === "env" ?
                        <div>
                            <h3 className="mapper-title"> Seleccione un ambiente </h3>
                            <hr /> <br /><br />
                        </div>
                        :
                        <div className="path-header">
                            <h4 className="path-name"> {config.pathName} </h4>
                            <Button onClick={back} type="primary" className="back-button">
                                <Icon type="left-square" />

                                Volver
                    </Button>
                            <Search
                                placeholder="Filtrar Elemento"
                                onSearch={value => console.log(value)}
                                className="search-box"
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                }

                {
                    <div>
                        {
                            filterText.length === 0 ?
                                <section className="mapper">
                                    {
                                        localData.map(item =>
                                            <div key={Object.values(item)[0]} className="single-container">
                                                <div onClick={() => filterData(item.id)} className="single-item">
                                                    <Icon className="item-icon" type="file" />
                                                    <h3 className="item-name">
                                                        {Object.values(item)[config.nameIndex]}
                                                    </h3>

                                                    <Button onClick={() => checkDetails(item.id)} type="primary" className="edit">
                                                        <Icon type="form" />
                                                        Editar
                                                    </Button>
                                                </div>
                                                
                                            </div>
                                        )
                                    }
                                </section>
                                :
                                <section className="mapper">
                                    {
                                        localData.filter(x => Object.values(x)[config.nameIndex].includes(filterText)).map(item =>
                                            <div key={item.id} className="single-container">
                                                <div onClick={() => filterData(item.id)} className="single-item">
                                                    <Icon className="item-icon" type="file" />
                                                    <h3 className="item-name">
                                                        {Object.values(item)[config.nameIndex]}
                                                    </h3>
                                                    <Button onClick={() => checkDetails(item.id)} type="primary" className="edit">
                                                        <Icon type="form" />
                                                        Editar
                                                    </Button>

                                                </div>
                                            </div>
                                        )
                                    }
                                </section>
                        }
                    </div>
                        
                        
                }

            </div>
        :
            <div className="loader-container">
                <Icon type="loading" />
            </div>
    )
}

export default withRouter(Mapper)