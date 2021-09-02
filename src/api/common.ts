import { post } from "../request/index"

export function userLogin(params: { account_number: string, password: string }) {
    return post("Login/login", { ...params })
}

export function userLoginOut() {
    return post("Login/logout")
}

export function getAsideList() {
    return post("Auth/authList")
}
