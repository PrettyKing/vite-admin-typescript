import { storage } from "@/utils/localStorage";
import { SET_DATA, SET_COLLAPSE, SET_BREADLIST } from "./constant";
import { userState } from "./store";

const mutations = {
    [SET_DATA](state: userState, payload: boolean): void {
        console.log("请求数据", payload)
        state.loading = payload
    },
    [SET_COLLAPSE](state: userState, payload: boolean): void {
        state.isCollapse = payload
    },
    [SET_BREADLIST](state: userState, payload: Array<string>): void {
        storage.set("breadList",payload)
        state.breadList = payload
    }
}

export default mutations