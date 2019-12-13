<template>
    <div id="homePage" style="height: 100%;">
        <div :class="notScroll? 'box preventTouchMove' : 'box'">
            <view class="search" :class="{searching: isSearch}">
                <view class="searchBox" @click="toSearch">
                    <img class="searchIcon" src="../../image/search.png">
                    <input type="text" @confirm="submit" :value="searchVal"  placeholder="请输入要搜索的商品名称" @input="getValue">
                    <img class="cancerImg" @click="clearInput"  v-show="isSearch" src="../../image/qixiu/cancer.png">
                </view>
                <div class="cancerBtn" @click="cancerSearch" v-show="isSearch">取消</div>
            </view>
            <div class="goodsPage"  v-show="!isSearch">
                <view class='titleBar'>
                    <!--<img :src="bgImg">-->
                    <swiper  autoplay="true" interval="3000" duration="1000"  circular="true" current="currentSwiper" @change="swiperChange" class="swiperSet">
                        <div @click="gotoNextView(item)" v-for="(item, index) in bannerList" :index="index" :key="key">
                            <swiper-item>
                                <image :src="item.img" class="slide-image" mode="aspectFill"/>
                            </swiper-item>
                        </div>
                    </swiper>
                    <div class="dots">
                        <div v-for="(item, index) in bannerList" :key ="key">
                            <div :class="index == currentSwiper ? 'dotSelected' : 'dotNormal' "></div>
                        </div>
                    </div>
                </view>
                <div class="navigateList" v-if="catList.length>0">
                    <div v-for="(item, key) in catList" @click="toNavigate(key, item)" class="navigateItem" :key="key">
                        <div class="navigateChild">
                            <img :src="item.img">
                            <p>{{item.name}}</p>
                        </div>
                    </div>
                </div>
                <div class='package'>
                    <div class="goosBg">
                        <div v-for="(item, index) in boardPromList" :key="index" class='goodsList'>
                            <img class="navbarImg" @click="prefecture(item)" :src="item.img">
                            <div v-for="(data, k) in item.billboarList" @click="toGoodsDetail(data)" :key="k" class="goodsItem">
                                <img :src="data.logo" alt="" class="goodsImg">
                                <div class="goodsLabel">{{data.shortname||data.name}}</div>
                                <div class="goodsPrice">{{data.price}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="supportProvider">Surpirse提供技术支持</div>
                </div>
            </div>
            <div class="searchData" v-show="isSearch">
                <div class="s-title">搜索历史</div>
                <div class="s-wrap">
                    <button class="item" @click="submit(item)" v-for="(item, t) in history" :key="t">{{item.name}}</button>
                </div>
                <button v-show="history.length>0" @click="clearSearchList" class="btn clear-btn">
                    清空搜索历史
                </button>
            </div>
        </div>
        <bindingphone :showBindPhone="loginModal" @listenToChildCloseModal="closeModal"></bindingphone>
        <!--<loading v-if="showLoading"></loading>-->
    </div>
</template>
<script>
import {
    encodeUrlParam
} from '@/utils/urlTool'
import * as API from '@/service/api'
import fetch from '@/service/fetch'
import {
    getStorage,
    setStorage
} from '@/utils/wechat'
import Config from '@/utils/config'
import bindingphone from '@/components/bindingphone'
import loading from '@/components/loading'
export default {
    components: {
        bindingphone,
        loading
    },
    data () {
        return {
            history: [],
            currentSwiper: 0, // swiper的index
            navigateList: [{
                img: require('../../image/1.jpg')
            }, {
                img: require('../../image/1.jpg')
            }, {
                img: require('../../image/1.jpg')
            }, {
                img: require('../../image/1.jpg')
            }],

            notScroll: false,
            bgImg: require('../../image/1.jpg'), // 测试用图
            inputCode: '',
            tabsPackageList: [],
            classList: [],
            searchVal: '',
            isSearch: false,
            bannerList: [],
            boardPromList: [],
            catList: []

        }
    },
    methods: {
        prefecture(item) {
            let param = {
                id: item.id,
                name: item.name,
                type: 3
            }
            let url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            wx.navigateTo({
                url
            })
        },
        clearInput() { // 清空搜索输入框
            this.searchVal = ''
        },
        submit(item) {
            let key = this.searchVal
            if (item && item.name) {
                key = item.name
            }
            if (key) {
                let history = this.history
                let newHistory = []
                for (let i = 0; i < history.length; i++) {
                    console.log(key, history[i].name)
                    if (history[i].name !== key) {
                        newHistory.push(history[i])
                    }
                }
                newHistory.unshift({ name: key, time: '' })
                this.history = newHistory
                setStorage('searchHistory', this.history)
            }
            let param = {
                name: key
            }
            let url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            wx.navigateTo({
                url
            })
        },
        toGoodsDetail(data) { // 跳到商品详情页
            let id = data.id
            let url = encodeUrlParam('../surprise/main?id=' + id)
            wx.navigateTo({
                url
            })
        },
        // 清空搜索列表
        clearSearchList() {
            setStorage('searchHistory', {})
            this.history = {}
            // wx.clearStorageSync(SEARCH_LIST)
            // this.handlerHistoryList()
        },
        toNavigate(n, item) { // 分类跳转
            let param = {
                name: item.name,
                id: item.kindid,
                type: 2
            }
            let url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            wx.navigateTo({
                url
            })
            // if (n === 7) {
            //     name = '全部分类'
            //     let param = {
            //         name: name,
            //         type: 2
            //     }
            //     url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            // } else {
            //     if (n === 0) {
            //         name = '德修区'
            //     } else if (n === 1) {
            //         name = '食修区'
            //     } else if (n === 2) {
            //         name = '功修区'
            //     } else if (n === 3) {
            //         name = '书修区'
            //     } else if (n === 4) {
            //         name = '香修区'
            //     } else if (n === 5) {
            //         name = '乐修区'
            //     } else if (n === 6) {
            //         name = '花修区'
            //     }
            //     let param = {
            //         name: name,
            //         type: 2,
            //         id: item.id
            //     }
            //     url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            // }
            // wx.navigateTo({
            //     url
            // })
        },
        toSearch() { // 搜索
            this.isSearch = true
        },
        cancerSearch() { // 取消搜索
            this.isSearch = false
        },
        getValue(e) { // 获取搜索关键字
            this.searchVal = e.mp.detail.value
            console.log(this.searchVal)
        },
        swiperChange(e) { // 轮播图变化监听
            // console.log('swiper滑动', e.mp.detail.current)
            this.currentSwiper = e.mp.detail.current
        },
        gotoNextView(item) { // 轮播图跳转
            console.log('轮播图点击跳转', item)
            // item.datalength: 0表示没有关联商品;1表示关联多个商品,查询是列表;其他则表示商品详情
            let url = ''
            if (parseInt(item.datalength) === 0) {
                console.log('没有关联商品')
                return
            } else if (parseInt(item.datalength) === 1) {
                let param = {
                    id: item.id,
                    name: item.name,
                    type: 1
                }
                url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            } else {
                let id = item.datalength
                url = encodeUrlParam('../surprise/main?id=' + id)
            }
            wx.navigateTo({
                url
            })
            // let param = {
            //     id: item.id,
            //     name: item.name,
            //     type: 1
            // }
            // let url = encodeUrlParam('../surprise/main?routeparam=' + JSON.stringify(param))
            // wx.navigateTo({
            //     url
            // })
        },
        getGoodsList() { // 获取套餐列表
            this.classList = []
            let params = {
                'version': '1.0',
                'head': {
                    'firstresult': 0,
                    'maxresults': 6,
                    'bodytype': 'flat',
                    'sortfields': []
                },
                'body': [{}]
            }
            this.showLoading = true
            fetch({
                method: 'POST',
                baseUrl: API.baseUrl,
                api: `${API.find}/${Config.orgCode}`,
                contentType: 'application/json; charset=UTF-8',
                params: params
            }).then(res => {
                console.log(res)
                if (res.data.head.faultcode === 'ok') {
                    if (res.data.body.length > 0) {
                        let data = res.data.body[0];
                        this.bannerList = data.bannerList;
                        this.boardPromList = data.boardPromList;
                        this.catList = data.catList;
                    }
                    console.log(this.boardPromList, 22222)
                }
            }, err => {
                console.log(err)
            })
        },
        errMsg(text) {
            wx.showToast({
                title: text || '请求超时，稍后重试',
                icon: 'none',
                duration: 2000
            })
        },
        closeModal(e) {
            this.loginModal = false
            if (!e) {
                console.log('调用关闭modal', e)
                // 如果是注册成功后,关闭modal.需要跳转到健康金页面
                if (this.groupName === 'group') {
                    let url = encodeUrlParam(`../healthCash/main`)
                    console.log('跳转到健康金url', url)
                    wx.navigateTo({ url })
                }
            }
            this.isModal = false
            this.notScroll = false
            this.modalTitle = ''
            this.modalList = []
        },
        clearData() {
            this.isSearch = false
        }
    },
    created() {
        setStorage('baseUrl', API.baseUrl)
    },
    onShow() {
        this.clearData()
        getStorage('searchHistory').then((res) => {
            this.history = res.data
        })
        this.getGoodsList()
    },
    mounted() {
    },
    onShareAppMessage(res) {
        console.log(res)
        // if (res.from === 'button') {
        //     console.log(res.target)
        // };
        // return {
        //     title: '治未病，让天下人少生病',
        //     path: '/pages/index/main',
        //     imageUrl: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/2c960003-3668-4c75-af80-08b74a37b527.jpg'
        // }
    }
}
</script>
<style lang='scss'>
    page{
        position: relative;
        height: 100%;
        /*overflow: auto;*/
    }
    .modal{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0, .6);
        z-index: 20000;
        .content{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
        }
    }
    .box{
        .search{
            position: relative;
            display: block;
            height: 98rpx;
            padding: 0 32rpx;
            background: rgb(245,245,245);
            overflow: hidden;
            .searchBox{
                display: block;
                height: 76rpx;
                margin: 11rpx;
                border-radius: 38rpx;
                -webkit-border-radius: 38rpx;
                background: #fff;
                overflow: hidden;
                .searchIcon,.cancerImg{
                    float: left;
                    width: 38rpx;
                    height: 38rpx;
                    margin: 19rpx 15rpx;
                }
                .cancerImg{
                    float: right;
                    width: 50rpx;
                    height: 50rpx;
                    margin: 13rpx 9rpx;
                }
                input{
                    float: left;
                    font-size: 28rpx;
                    width: calc(100% - 136rpx);
                    margin: 19rpx 0rpx;
                    height: 38rpx !important;
                    min-height: 38rpx !important;
                }
            }
        }
        .searching{
            padding-right: 110rpx;
            .searchBox{
                border-radius:0rpx !important;
                -webkit-border-radius:0rpx !important;
            }
            .cancerBtn{
                position: absolute;
                top: 19rpx;
                right: 15rpx;
                color: #fff;
                padding: 0 20rpx;
                height: 60rpx;
                line-height: 60rpx;
                font-size: 28rpx;
                background: #fd4346;
            }
        }
        .titleBar{
            position: relative;
            width: 750rpx;
            height: 450rpx;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
            .swiperSet{
                width: 100%;
                height: 450rpx;
                .slide-image{
                    width: 100%;
                    height: 100%;
                }
            }
            /*用来包裹所有的小圆点  */
            .dots{
                width: 100%;
                height: 60rpx;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: 0rpx;
                bottom: 0rpx;
            }
            .dotNormal,.dotSelected {
                margin: 10rpx;
                width: 16rpx;
                height: 16rpx;
                border-radius: 50%;
            }

            /*未选中时的小圆点样式 */
            .dotNormal{
                background-color: rgba(130,130,130,0.8);
            }
            /*选中以后的小圆点样式  */
            .dotSelected{
                background-color: rgba(202,202,202,0.8);
            }
        }
        .messageBar{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 120rpx;
            background: rgba(253,58,63,.8);
            overflow: hidden;
            .tipMsg{
                float: left;
                margin-left: 20rpx;
                height: 120rpx;
                line-height: 120rpx;
                font-size: 24rpx;
                color: #fff;
            }
            img{
                float: left;
                width: 140rpx;
                height: 120rpx;
                opacity: 0.8
            }
            .login{
                width: 100rpx;
                height: 48rpx;
                border: 2rpx solid #fff;
                line-height: 48rpx;
                margin: 36rpx 0;
                font-size: 22rpx;
                color: #fff;
                float: right;
                margin-right: 20rpx;
                text-align: center;
                border-radius: 8rpx;
                -webkit-border-radius: 8rpx;
            }
        }
        .bottomModal{
            height: 1000rpx;
        }
        .navigateList{
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            .navigateItem{
                position: relative;
                width: 187.5rpx;
                height: 187.5rpx;
                margin: 20rpx 0;
                overflow: hidden;
                .navigateChild{
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    };
                }
            }
        }
        .package{
            .supportProvider{
                font-size: 28rpx;
                padding: 40rpx 0;
                text-align: center;
                color: #ccc;
                background: #f5f5f5;
            }
            .title-one{
                position: relative;
                height: 100rpx;
                line-height: 100rpx;
                overflow: hidden;
                border-bottom:2rpx solid #F8F8F8;
                .left{
                    float: left;
                    font-size: 28rpx;
                    color: #1b1b1b;
                    margin-left: 20rpx;
                }
                .right{
                    float: right;
                    font-size: 22rpx;
                    color: #888;
                    margin-right: 30rpx;
                }
                .morePackage{
                    width: 22rpx;
                    height: 20rpx;
                    position: absolute;
                    top: 40rpx;
                    right: 10rpx;

                }
            }
            .classification{
                display: flex;
                margin: 0 20rpx;
                justify-content: space-between;
                .tabs{
                    padding: 20rpx 0;
                    height: 48rpx;
                    font-size: 24rpx;
                    line-height: 48rpx;
                    width: 120rpx;
                    text-align: center;
                }
                .tabsSelect{
                    border-bottom: 4rpx solid #fd4346;
                    color: #fd4346;
                }
                .tabsNormal{
                    color: #1b1b1b;
                }
            }
            .classification-page{
                border-bottom: 20rpx solid #f1f1f1;
                box-shadow: 0 5px 15px 0 rgba(78,24,2,0.12);
                .classification-list{
                    .card{
                        height: 438rpx;
                        z-index: 100;
                        background: #fff;
                    }
                    .packImg{
                        position: relative;
                        overflow: hidden;
                        img{
                            display: block;
                            width: 750rpx;
                            height: 320rpx;
                            margin: 0;
                            padding: 0;
                        }
                        .packDetail{
                            position: absolute;
                            right:10rpx;
                            bottom: 10rpx;
                            width: 110rpx;
                            height: 36rpx;
                            font-size: 24rpx;
                            color: #fd4346;
                            border-radius: 18rpx;
                            -webkit-border-radius: 18rpx;
                            background: #f1f1f1;
                            .package-nickName{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                img{
                                    width: 30rpx;
                                    height: 30rpx;
                                    margin-left: 10rpx;
                                }
                            }
                        }
                        .label{
                            position: absolute;
                            top: 10rpx;
                            width: 100%;
                            height: 36rpx;
                            .label-line{
                                width: 100%;
                                height: 100%;
                                overflow: hidden;
                            }
                            .text{
                                float: right;
                                margin-right: 10rpx;
                                width: 80rpx;
                                height: 36rpx;
                                font-size: 24rpx;
                                color: #fff;
                                text-align: center;
                                border-radius: 5rpx;
                                background: rgba(229,158,42,.8);
                            }
                        }
                    }
                    .classTitle{
                        position: relative;
                        display: flex;
                        margin: 0 20rpx;
                        height: 118rpx;
                        overflow: hidden;
                        .buyBtn{
                            width: 130rpx;
                        }
                        .packageModal{
                            flex: 1;
                            .name{
                                display: flex;
                                flex-direction: row;
                                height: 28rpx;
                                line-height: 28rpx;
                                font-size: 28rpx;
                                color: #1b1b1b;
                                margin: 20rpx 0;
                                .detailBtn{
                                    position: relative;
                                    height: 40rpx;
                                    line-height: 40rpx;
                                    border-radius: 20rpx;
                                    background: #f5f6f5;
                                    color: #1b1b1b;
                                    text-align: center;
                                    font-size: 20rpx;
                                    width: 150rpx;
                                    padding-right: 20rpx;
                                    margin-top: -6rpx;
                                    margin-left: 5rpx;
                                    /*margin-top: 40rpx;*/
                                    .double{
                                        position: absolute;
                                        right: 10rpx;
                                        top: 10rpx;
                                        width: 30rpx;
                                        height: 30rpx;
                                        animation: myfirst 2s infinite;
                                    }
                                    @keyframes myfirst {
                                        0% {
                                            transform: translate(0px, 0px);
                                        }
                                        50% {
                                            transform: translate(0px, -8rpx);
                                        }
                                        100% {
                                            transform: translate(0px, 0px);
                                        }
                                    }
                                }
                            }
                            .price{
                                height: 30rpx;
                                line-height: 30rpx;
                                font-size: 30rpx;
                                color: #fd4346;
                                margin: 20rpx 0;
                                span{
                                    font-size: 24rpx;
                                    color: #888888;
                                    margin-left: 20rpx;
                                    text-decoration:line-through;
                                }
                            }
                        }
                        .buyBtn{
                            justify-content: flex-end;
                            .buy{
                                width: 120rpx;
                                height: 48rpx;
                                margin: 35rpx auto;
                                line-height: 48rpx;
                                color: #fd4346;
                                border: 2rpx solid #fd4346;
                                border-radius: 8rpx;
                                -webkit-border-radius: 8rpx;
                                overflow: hidden;
                                font-size: 22rpx;
                                text-align: center;
                            }
                        }
                    }
                }
            }
            .goosBg{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .goodsList{
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    .navbarImg{
                        width: 100%;
                        height: 150rpx;
                    }
                    .goodsItem{
                        width: 50%;
                        margin: 0 0 20rpx;
                        float: left;
                        box-sizing: border-box;
                        -webkit-box-sizing: border-box;
                        .goodsImg{
                            width: 100%;
                            height: calc(50vw - 10rpx);
                            display: block;
                        }
                        .goodsLabel{
                            width: 100%;
                            text-indent: 10rpx;
                            color: #1B1B1B;
                            font-size: 26rpx;
                            line-height: 26rpx;
                            overflow: hidden;
                            text-align: center;
                            margin: 10rpx 0;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .goodsPrice{
                            text-align: center;
                            color: #FD4346;
                            margin: 10rpx 0;
                            font-size: 30rpx;
                        }
                    }
                    .goodsItem:nth-child(2n){
                        padding-right: 10rpx;
                    }
                    .goodsItem:nth-child(2n+1){
                        padding-left: 10rpx;
                    }
                }
            }
            .collapse{
                position: relative;
                border-top: 2rpx solid #f1f1f1;
                border-bottom: 20rpx solid #f1f1f1;
                overflow: hidden;
                z-index: 50;
                .title{
                    display: block !important;
                    height: 110rpx;
                    line-height: 110rpx;
                    color: #1b1b1b;
                    font-size: 28rpx;
                    text-align: center;
                    border-bottom: 2rpx solid #F1F1F1;
                }
                ul{
                    li{
                        border-bottom: 2rpx solid #F1F1F1;
                        margin-left: 30rpx;
                        .line{
                            position: relative;
                            display: block;
                            padding:30rpx 40rpx 20rpx 0;
                            box-sizing: border-box;
                            -webkit-box-sizing: border-box;
                            /*overflow: hidden;*/
                            .smallBox{
                                position: absolute;
                                left: -15rpx;
                                width: 10rpx;
                                top: 26rpx;
                                height: 36rpx;
                                background: #FD4346;
                            }
                            .left{
                                position: relative;
                                margin:0 30rpx 0 0;
                                h5{
                                    font-size: 28rpx;
                                    line-height: 28rpx;
                                    color: #323232;
                                    font-weight: normal;
                                }
                            }
                            .right{
                                position: relative;
                                margin:0 20rpx 0 0;
                                font-size: 24rpx;
                                color: #727272;
                                .discription{
                                    margin-top:30rpx;
                                }
                            }
                            .icon-box{
                                position: absolute;
                                top: 0;
                                width: 20rpx;
                                height: 20rpx;
                                right: -40rpx;
                                bottom: 0;
                                .icon-child{
                                    width: 100%;
                                    height: 100%;
                                    img{
                                        display: block;
                                        width: 20rpx;
                                        height: 20rpx;
                                    }
                                }
                            }
                        }
                        .lineBottom{
                            padding-bottom: 10rpx;
                        }
                        .childModal{
                            border-top: 2rpx solid #f1f1f1;
                            .childDetail{
                                padding: 5rpx;
                                margin-left: 20rpx;
                                padding-right: 40rpx;
                                border-bottom: 2rpx solid #f1f1f1;
                                .left{
                                    h5{
                                        font-size: 24rpx;
                                        color:#323232;
                                        margin: 20rpx 0;
                                        font-weight: normal;
                                    }
                                }
                                .right{
                                    font-size: 24rpx;
                                    color: #727272;
                                    margin: 0 ;
                                    margin-left: 10rpx;
                                    margin-bottom: 20rpx;
                                }
                            }
                            .noBorder{
                                border:none !important;
                            }
                        }
                        .content{
                            border-top: 2rpx solid #ebedec;
                        }
                    }
                }
            }
            /*base code*/
            .animated {
                -webkit-animation-duration: 0.3s;
                animation-duration: 0.3s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
            }
            .animated.infinite {
                -webkit-animation-iteration-count: infinite;
                animation-iteration-count: infinite;
            }
            .animated.hinge {
                -webkit-animation-duration: 0.3s;
                animation-duration: 0.3s;
            }
            /*the animation definition*/
            @-webkit-keyframes fadeInDownBig {
                0% {
                    opacity: 0;
                    -webkit-transform: translate3d(0, -500rpx, 0);
                    transform: translate3d(0, -500rpx, 0)
                }
                100% {
                    opacity: 1;
                    -webkit-transform: none;
                    transform: none
                }
            }
            @keyframes fadeInDownBig {
                0% {
                    opacity: 0;
                    -webkit-transform: translate3d(0, -500rpx, 0);
                    -ms-transform: translate3d(0, -500rpx, 0);
                    transform: translate3d(0, -500rpx, 0)
                }
                100% {
                    opacity: 1;
                    -webkit-transform: none;
                    -ms-transform: none;
                    transform: none
                }
            }
            .fadeInDownBig {
                -webkit-animation-name: fadeInDownBig;
                animation-name: fadeInDownBig
            }
            .title{
                display: flex;
                .t-left,.t-right{
                    flex: 1;
                    text-align: center;
                    height: 80rpx;
                    line-height: 80rpx;
                }
            }
        }
        .searchData{
            width: 100%;
            padding: 0 30rpx 30rpx 30rpx;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            height: calc(100vh - 98rpx);
            .s-title{
                font-size:22rpx;
                height:60rpx;
                display:flex;
                align-items:center;
                color:#999;
            }
            .s-wrap{
                display:flex;
                flex-wrap:wrap;
                .item{
                    display:inline-block;
                    height:60rpx;
                    border-radius:3px;
                    font-size:25rpx;
                    white-space:nowrap;
                    color:#555;
                    margin:0 15rpx 15rpx 0;
                    background-color:#f5f5f5;
                }
            }
            .clear-btn{
                display:flex;
                align-items:center;
                justify-content:center;
                margin:30rpx auto;
                width:230rpx;
                font-size:25rpx;
                color:#666;
                border-radius:35rpx;
                height:70rpx;
                background:#fff;
                border:1px solid #f5f5f5;
            }
        }
    }
    button{
        position:relative;
        display:block;
        margin-left:auto;
        margin-right:auto;
        padding-left:14px;
        padding-right:14px;
        box-sizing:border-box;
        font-size:18px;
        text-align:center;
        text-decoration:none;
        line-height:2.55555556;
        border-radius:5px;
        -webkit-tap-highlight-color:transparent;
        overflow:hidden;
        color:#000000;
        background-color:#F8F8F8;
    }
    button::after{border: none}
    .preventTouchMove{
        top: 0px ;
        left:   0px ;
        width:   100% ;
        height:   100% ;
        overflow:   hidden ;
        position:   fixed ;
        z-index:   0 ;
    }
</style>
