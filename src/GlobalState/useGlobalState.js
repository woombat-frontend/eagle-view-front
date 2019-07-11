import { useState } from 'react'

// El estado general es este objeto. Se recomienda mantener esta estructura como contenedor de arrays, strings, otros objetos...etc
const State = {
    currentRoute: "main",
    data: {},
    singleJson: {
        type: "",
        data: {}
    }
}

const useGlobalState = () => {
    const [state, setState] = useState(State)

    const actions = action => {
        const { type, payload } = action

        switch (type) {
            case "setState": {
                return setState(payload)
            }
            case "getState": {
                console.log(state)
                return state;
            }
            default: return state;
        }
    }
    return { state, actions }
}

export default useGlobalState