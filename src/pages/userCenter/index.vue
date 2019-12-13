<template>
<div class="userCenterSet">
    <div class="infoset">
        <img class="bgImg" src="https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/4d9f3d6a-df59-440d-bcdb-f91c1260ae70.jpg">
        <div class="topBox">
            <open-data class="headImg"  type="userAvatarUrl"></open-data>
        </div>
        <div class="nickName">
            <open-data  type="userNickName" lang="zh_CN"></open-data>
        </div>
    </div>
    <div>
        <div class="listSet" v-for ="(item, index) in listArray" :key="index" @click="itemChange(item, index)">
            <img :src="item.img" alt="" class="avatorSet">
            <div class="titleSet">{{item.title}}</div>
            <img src="../../image/blackarrow.png" alt="" class="arrowSet">
        </div>
    </div>
    <div class="connectService">
        <button class='tell-btn btn' open-type='contact'>联系客服</button>
        <p>Surpirse提供技术支持</p>
    </div>
    <bindingphone :showBindPhone="loginModal" @listenToChildCloseModal="closeModal"></bindingphone>
</div>
</template>

<script>
import {
    encodeUrlParam
} from '@/utils/urlTool'
import bindingphone from '@/components/bindingphone'
import {
    getStorage
} from '@/utils/wechat'
import MD from '@/utils/thirdParty/maidian';
export default {
    components: {
        bindingphone
    },
    data() {
        return {
            loginModal: false,
            userInfo: {
                hearUrl: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/eaacbfcd-7224-494a-8b40-ec6d1c61c50a.jpg',
                nickName: '江小白'
            },
            listArray: [
                {
                    title: '个人',
                    url: '../surpirse/main',
                    img: require('../../image/userCenter0.png')
                },
                {
                    title: '我的',
                    url: '../surpirse/main',
                    img: require('../../image/userCenter1.png')
                },
                {
                    title: '我的订单',
                    url: '../surpirse/main',
                    img: require('../../image/userCenter2.png')
                },
                {
                    title: '我的',
                    url: '../surpirse/main',
                    img: require('../../image/userCenter3.png')
                },
                {
                    title: '报告',
                    url: '../surpirse/main',
                    img: require('../../image/userCenter4.png')
                },
                {
                    title: '足迹',
                    url: '../surpirse/main',
                    img: require('../../image/qixiu/foot.png')
                },
                {
                    title: '收藏',
                    url: '../surpirse/main',
                    img: require('../../image/qixiu/collect.png')
                }
                // {
                //     title: '分享返利',
                //     url: '../mallShareRebate/main',
                //     img: require('../../image/qixiu/share.png')
                // }
                // {
                //     title: '退出',
                //     url: '../myReport/main',
                //     img: require('../../image/qixiu/exit.png')
                // }
                // {
                //     title: '健康档案',
                //     url: '../webviewPage/main',
                //     img: require('../../image/qixiu/exit.png')
                // }
            ]
        }
    },
    methods: {
        itemChange(item, index) {
            getStorage('mobile').then((resolve) => {
                let mobile = resolve.data
                if (mobile) {
                    let url = encodeUrlParam(item.url)
                    wx.navigateTo({ url })
                } else {
                    this.loginModal = true
                }
            }).catch(err => {
                console.log(err)
            });
        },
        closeModal(e) {
            this.loginModal = false
        },
        mdFn(e, bindDom = false) {
            try {
                let data = e
                if (bindDom) {
                    // let item = e
                }
                MD(data)
            } catch (e) {
                console.log(e)
            }
        }
    },
    onShow() {
    },
    created() {
    },
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
.userCenterSet{
    /*background-color:#F6F6F6;*/
    .infoset{
        width: 100%;
        height: 280rpx;
        /*background-color: #FA8C8E;*/
        overflow: hidden;
        margin-top: -4rpx;
        .bgImg{
            position: absolute;
            z-index: -1;
            width: 750rpx;
            height: 280rpx;
        }
        .topBox{
            width: 120rpx;
            height: 120rpx;
            margin: 55rpx 315rpx 0rpx 315rpx;
            border-radius: 60rpx;
            -webkit-border-radius: 60rpx;
            overflow: hidden;
            .headImg{
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .nickName{
            height: 30rpx;
            line-height: 30rpx;
            text-align: center;
            font-size: 28rpx;
            margin-top: 20rpx;
            color: #FFFFFF;
        }
    }
    .listSet{
        padding: 0 20rpx;
        height: 110rpx;
        border-bottom: 2rpx solid #F6F6F6;
        .avatorSet{
            display: inline-block;
            height: 40rpx;
            width: 40rpx;
            margin: 35rpx 20rpx 35rpx 0;
        }
        .titleSet{
            vertical-align: top;
            display: inline-block;
            height: 110rpx;
            width: 610rpx;
            line-height: 110rpx;
            font-size: 28rpx;
            color: #1b1b1b;
        }
        .arrowSet{
            vertical-align: top;
            display: inline-block;
            height: 25rpx;
            width: 25rpx;
            margin: 42.5rpx 0rpx 42.5rpx 5rpx;
        }
    }
    .connectService{
        background: #f9f9f9;
        margin-bottom: 20rpx;
        overflow: hidden;
        .tell-btn {
            margin:0 auto;
            margin:60rpx auto;
            width:300rpx;
            height:70rpx;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-size:14px;
            border-radius:10rpx;
            background-color:#FD4346;
        }
        p{
            font-size: 28rpx;
            text-align: center;
            color: #ccc;
            margin: 60rpx 0;
        }
    }
}

</style>

