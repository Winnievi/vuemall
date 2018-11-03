//把第三方库改成插件
import axios from 'axios'

const HttpTool = {}

HttpTool.install = function(Vue) {

    // 4. 添加实例方法
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

    Vue.prototype.$http = axios
}

export default HttpTool