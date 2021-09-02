import { useStore } from "vuex"
import { State } from "../store"
import { Getters, Action } from "../store/utils";

interface IUserStore {
    state: State;
    getters: Getters,
    dispatch(action: Action, payload?: unknown): void
}


export const useHStore = () => {
    const store = useStore<State>()
    const { state, getters, dispatch }: IUserStore = store;
    return {
        state,
        getters,
        dispatch
    }
}
