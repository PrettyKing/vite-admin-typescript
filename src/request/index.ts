import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import router from "../router/index"
import { ElMessage } from "element-plus"
import { storage } from "@utils/localStorage/index"
import { addPending, removePending } from "./cancel";
import qs from "qs"


// axios.defaults.baseURL = "/api/"

const rq = axios.create({
    baseURL: "/api/",
    // baseURL: "http://localhost:8000/2016-08-15/proxy/YD_VIP/app",
    timeout: 30000,
    // headers: {
    //   "content-type": "application/json;charset=utf-8",
    // },
    // withCredentials: true,
});

rq.interceptors.request.use((config: AxiosRequestConfig) => {
    if (storage.get("USER_TOKEN")) {
        config.headers['token'] = storage.get("USER_TOKEN");
    }
    config.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";
    addPending(config);
    return config
}, error => {
    return Promise.reject(error);
})


rq.interceptors.response.use(
    (response: AxiosResponse) => {
        return new Promise((resolve, reject) => {
            removePending(response);
            const res = response.data;
            if (res.code == 200) {
                resolve(res);
            } else if (res.code === 40104) {
                ElMessage.warning({ type: 'warning', message: '用户登陆过期，请重新登陆!!' });
                setTimeout(() => {
                    router.replace({
                        path: '/login',
                        // query: {
                        //     redirect: router.currentRoute.fullPath,
                        // },
                    });
                }, 1000);
            } else {
                ElMessage.warning({ type: 'warning', message: res.message });
                reject(res);
            }
        })
    },
    error => {
        //断网处理或者请求超时
        if (!error.response) {
            //请求超时
            if (error.message.includes('timeout')) {
                console.log('超时了');
                ElMessage.error('请求超时，请检查互联网连接');
            } else {
                //断网，可以展示断网组件
                console.log('断网了');
                ElMessage.error('请检查网络是否已连接');
            }
            return Promise.reject(error);
        }
        const status = error.response.status;
        switch (status) {
            case 500:
                ElMessage.error('服务器内部错误');
                break;
            case 404:
                ElMessage.error('未找到远程服务器');
                break;
            case 40104:
                ElMessage.error('用户登陆过期，请重新登陆');
                // store.state.commit('COMMIT_TOKEN', '');
                setTimeout(() => {
                    router.replace({
                        path: '/login',
                        // query: {
                        //     redirect: router.currentRoute.fullPath,
                        // },
                    });
                }, 1000);
                break;
            case 400:
                ElMessage.error('数据异常，详情请咨询聚保服务热线');
                break;
            default:
                ElMessage.error(error.response.data.message);
        }
        return Promise.reject(error);
    }
)

/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url: string, params = {}) {
    return new Promise((resolve, reject) => {
        rq
            .post(url, qs.stringify(params))
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export default rq