import { userState } from "./store";

const getters = {
    isLogin: (state: userState): string => {
        return `getters数据${state.loading}`
    },
    isCollapse:(state:userState):string => {
        return `getters数据${state.isCollapse}`
    }
}

export default getters