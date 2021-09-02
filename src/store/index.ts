import { createStore } from "vuex";
import { modules } from './modules'
import { userState } from "./modules/user/store";

export interface State {
    user: userState
}

export default createStore<State>({
    modules,
});