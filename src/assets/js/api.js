import axios from 'axios'
import Base64 from './base64'
// let FC = ''
let FC = 'https://bird.ioliu.cn/v1?url='
function run(data, access_token, fun, oa) {
    if (!data.headers) data.headers = {}
    data.headers.Authorization = 'Bearer ' + access_token
    axios(data).then(function (res) {
        fun(res)
    }).catch(function (error) {
        if (error.toString().indexOf('401') !== -1) {
            console.log('令牌到期，重新获取')
            localStorage.removeItem(oa)
            main.ajax(data, oa)
        } else {
            if (data.error) data.error(error)
            console.log(error)
        }
    })
}
const main = {
    axios,
    ajax: function (data, oa) {
        let access_token = localStorage.getItem(oa)
        if (access_token) {
            run(data, access_token, data.success, oa)
        } else {
            main.OAuth(oa).then(function (res) {
                console.log(res.data.access_token)
                localStorage.setItem(oa, res.data.access_token)
                run(data, res.data.access_token, data.success, oa)
            })
        }
    },
    OAuth(scope) {
        return axios({
            url: FC + main.authenticate,
            method: 'POST',
            // headers: {
            //     'content-type': 'application/x-www-form-urlencoded'
            // },
            data: {
                client_id: 'mlcx2YQRhgB3s7MMs6magAb6ZAl8fkNE',
                client_secret: 'ANaEg5gNsSeGUpip',
                grant_type: 'client_credentials',
                scope
            }
        })
    },
    encode(m) {
        return new Base64().encode(m)
    },
    decode(m) {
        return new Base64().decode(m)
    },
    designdata: 'https://developer.api.autodesk.com/modelderivative/v2/designdata',
    authenticate: 'https://developer.api.autodesk.com/authentication/v1/authenticate',               //获取认证
    buckets: 'https://developer.api.autodesk.com/oss/v2/buckets'                                     //操作存储桶
}
export default main