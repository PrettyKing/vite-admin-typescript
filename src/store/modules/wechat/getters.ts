import { userState } from "./store";

const getters = {
    test: (state: userState): string => {
        return `getters数据${state.loading}`
    }
}

export default getters