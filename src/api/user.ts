import { post } from "../request/index"

export function userList() {
    return post("AdminUsers/index")
}

export interface IAddUser {
    name: string,
    account_number: string,
    password: string,
    auth: string,
    status: number
}

export function addUser(data: IAddUser) {
    return post('AdminUsers/setAdminUser', data)
}
export interface IDeleteUser {
    ids: Array<number>
}

export function deleteUser(ids: IDeleteUser) {
    return post("AdminUsers/deleteAdminUser", ids)
}

export function userTypeList() {
    return post('Auth/indexGroup')
}