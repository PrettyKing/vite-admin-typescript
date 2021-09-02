import { storage } from "@/utils/localStorage";

const createStore = () => {
    const store = {
        loading: false,
        isCollapse: false,
        breadList: storage.get("breadList") || ['首页']
    }
    return store
}

export type userState = ReturnType<typeof createStore>;

export default createStore