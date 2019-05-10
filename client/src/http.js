import axios from "axios";
import { Message, Loading, MessageBox } from 'element-ui';
import router from './router'

// let loading; 
// function startLoading() {
//     loading = Loading.service({
//         lock: true,
//         text: '拼命加载中...',
//         background: 'rgba(0,0,0,0,7)'
//     });
// }
// function endLoading() {
//     loading.close()
// }

// function resdiglog(data) {
//     switch (data.code) {
//         case 0:

//             break;
//         case 11:
//         Message.error(data.msg);
//             break;
//         default:
//             break;
//     }
// }

// 请求拦截
axios.interceptors.request.use(config => {
    // 加载动画
    // startLoading();
    if (localStorage.Token) {
        // 配置请求头
        config.headers.Authorization = localStorage.Token;
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, err => {
    return Promise.reject(err);
})

// 响应拦截
axios.interceptors.response.use(response => {
    // endLoading();
    if (response.data.code == '11') {
        Message.error(response.data.msg);
    }
    return response;
    // console.log(response);
    // return resdiglog(response.data);
}, err => {
    // endLoading();
    Message.error('出错');
    console.log(err.response.data);
    
    // 获取错误状态码
    const { status } = err.response;
    if (status == 401) {
        Message.error('登录失效,请重新登陆');
        localStorage.removeItem('Token')
        router.push('./login')
    }
    if (status == 400) {
        // resdiglog(response.data)
        Message.error(err.response.data.msg);
    }
    return Promise.reject(err);
})

export default axios;