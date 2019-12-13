// baseUrl
// export let baseUrl = 'https://mirror-test.v.laikang.com'; // dev环境
// export let baseUrl = 'http://10.4.105.123:8080'; // dev环境
// export let baseUrl = 'http://10.4.109.59:8080'; // dev环境
export let baseUrl = 'https://mirror.laikang.com'; // 生产环境
// export let qiuxiuUrl = 'https://mirror-test.v.laikang.com/api/actions' // 七修商城域名

if (process.env.NODE_ENV === 'qualityAssurance') {
    baseUrl = 'https://---.com'; // qa环境
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://----.com'; // pro环境
}
console.log(baseUrl);


/* openGId解码 */
export const getOpenGId = '/api/v1/xchx/getOpenGId';
// 登录
export const login = '/api/login/wxappcode';
// 检测是否登录
export const isLogin = '/api/user/info';
// 获取套餐或则商品列表 type 可选值healthcheck，goods




