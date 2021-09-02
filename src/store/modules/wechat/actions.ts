import { ActionContext } from "vuex";
import { GET_DATA } from "./constant";
import { userState } from "./store";

export const actions = {
    [GET_DATA]({ commit }: ActionContext<userState, unknown>): void {
        setTimeout(function () {
            const payload = true
            commit(GET_DATA, payload);
        }, 2000)
    }
}