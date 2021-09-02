import { ActionContext } from "vuex";
import { GET_DATA, GET_COLLAPSE, GET_BREADLIST, SET_COLLAPSE, SET_BREADLIST } from "./constant";
import { userState } from "./store";

const actions = {
    [GET_DATA]({ commit }: ActionContext<userState, unknown>): void {
        setTimeout(function () {
            const payload = true
            commit(GET_DATA, payload);
        }, 2000)
    },
    [GET_COLLAPSE]({ commit }: ActionContext<userState, unknown>, data: boolean): void {
        commit(SET_COLLAPSE, data)
    },
    [GET_BREADLIST]({ commit }: ActionContext<userState, unknown>, data: Array<string>) {
        commit(SET_BREADLIST, data)
    }
}
export default actions