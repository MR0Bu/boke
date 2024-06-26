<script setup lang="ts">
import router from '../router/routers';
import axios from '../api/request';
import { onMounted, ref } from "vue";
import { message } from 'ant-design-vue';
import { Plus, Search, StarFilled, ChatDotRound } from '@element-plus/icons-vue'
import { LikeOutlined } from '@ant-design/icons-vue';
import type { UploadProps, UploadUserFile, UploadFile } from 'element-plus'

//路由
function Post() {
    router.push('/post')
}
function Home() {
    if (sessionStorage.getItem('UserId') != '') {
        sessionStorage.removeItem('UserId')
    }
    router.push('/home')
}

//好友列表
const drawer = ref(false)
const friends = ref()
//好友昵称
//弹窗
const FriendNoteNameVisible = ref(false)
const FriendNoteName = ref()
function ChangeName(friendId: any) {
    sessionStorage.setItem('friendId', friendId)
    FriendNoteNameVisible.value = true
}
async function Note() {
    if (FriendNoteName.value != null) {
        message.success('修改成功!', 2)
    }
    const resp = await axios.post(`UserFriend/updateFriendNoteName`, { friendId: sessionStorage.getItem('friendId'), userFriendNoteName: FriendNoteName.value }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    // console.log(resp.data.data)
    location.reload()
}

//跳转详细页
async function details(BlogId: any, UserId: any) {
    // console.log(BlogId)
    // console.log(UserId)
    sessionStorage.setItem("BlogId", BlogId)
    sessionStorage.setItem("UserId", UserId)
    router.push('/details')
}

//查询文章
interface LinkItem {
    value: string
    link: string
}

const serachValue = ref('')
const links = ref<LinkItem[]>([])

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value
    cb(results)
}
const createFilter = (queryString: any) => {
    return (restaurant: any) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

function loadAll(value: any) {
    // console.log(value)
    for (let index = 0; index < value.length - 1; index++) {
        let temp = ref({
            value: '',
            link: ''
        })
        temp.value.value = value[index]
        // console.log(temp)
        links.value[index] = temp.value
    }
    // console.log(links.value)
}
const search = async () => {
    if (serachValue.value == '') {
        update()
    } else {
        const resp = await axios.post(`Article/out/getArticlesBySearch`, { keyword: serachValue.value }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        Blogs.value = resp.data.data
        console.log(Blogs.value)
        // console.log(resp.data.data);
    }
    console.log(serachValue.value)
}


//删除文章
async function ADelete(BlogId: any) {
    // console.log(BlogId)
    const resp = await axios.delete(`Article/delete/${BlogId}`)
    console.log(resp.data)
    message.success("删除成功", 2)
    location.reload()
}

//退出登陆
function LoginOut() {
    sessionStorage.removeItem("data")
    sessionStorage.removeItem("url")
    sessionStorage.removeItem("loginUserId")
    router.push('/home')
}

// 设置弹窗
const SettingVisible = ref(false)

// 更新用户信息
const updateUser = ref({
    userName: '',
})
const upload = ref()

const UpdateUser = async (file: UploadFile) => {
    // console.log(file)
    if (!file.url) file.url = URL.createObjectURL(file.raw as any)
    fileList.value[0] = file
    console.log(fileList.value[0])
    upload.value = fileList.value[0]
}
//头像上传
const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile)
    console.log(uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

//刷新界面并且上传
async function flash() {
    if (updateUser.value.userName != null) {
        const resp = await axios.post(`user/update`, updateUser.value)
        console.log(resp.data.data)
    }
    if (upload.value != null) {
        // console.log(upload.value.raw)
        const resp1 = await axios.post(`user/upload-avatar`, { file: upload.value.raw }, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (resp1.data.code == 1) {
            const resp = await axios.get(`user/getUserStatistics`)
            console.log(resp.data.data)
            sessionStorage.setItem('url', resp.data.data.userProfilePhoto)
        }
    }
    location.reload()
}

//分页
const nowPage = ref(1)
const totalPages = ref(10)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
    console.log(val)
}
const handleCurrentChange = async (val: number) => {
    // console.log(val)
    const resp = await axios.post(`Article/getMyArticles`, { page: val }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    console.log(resp.data.data)
    Blogs.value = resp.data.data
    console.log(Blogs.value)
    const resp1 = await axios.get(`Article/getMyArticlesSize`)
    totalPages.value = resp1.data.data
    // console.log(resp1.data.data)
}
//初始化用户信息
const User = ref()

//初始头像
const URl = ref()
//初始化博客
const Blogs = ref()
//预加载
async function update() {
    //初始化头像
    if (sessionStorage.getItem('url') == null) {
        URl.value = '4.jpg'
    } else {
        URl.value = sessionStorage.getItem('url')
    }
    //已登录用户信息
    const resp = await axios.get(`user/getUserStatistics`)
    User.value = resp.data.data
    updateUser.value.userName = User.value.userName
    // console.log(User.value)
    //已登录用户博客信息
    handleCurrentChange(1)
    //搜索框联想
    const resp3 = await axios.get(`Article/out/getAllTitle`)
    // console.log(resp3.data.data)
    loadAll(resp3.data.data)

    //好友
    const resp1 = await axios.get(`UserFriend/getMyFriends`)
    console.log(resp1.data.data)
    friends.value = resp1.data.data
}
onMounted(() => update());
</script>
<template>
    <!-- 好友弹窗 -->
    <el-drawer size="20%" v-model="drawer" title="好友列表">
        <el-divider />
        <div style="display: flex;width: 100%;margin: 2%;height: 6%;" v-for="c of friends">
            <img v-bind:src="c?.userFriendProfilePhoto" style=" width: auto;border-radius: 50%;height: 100%;">
            <div style="font-size:x-large;font-weight: bold;align-content: center;margin-left: 5%;"
                v-if="c?.userFriendNoteName == null">
                {{ c?.userFriendName }}
            </div>
            <div style="font-size:x-large;font-weight: bold;align-content: center;margin-left: 5%;"
                v-if="c?.userFriendNoteName != null">
                {{ c?.userFriendNoteName }}
            </div>
            <div style="align-content: center;margin-left: auto;">
                <el-button @click="ChangeName(c?.userFriendId)">修改昵称</el-button>
            </div>
        </div>
    </el-drawer>
    <!-- 修改昵称弹窗 -->
    <el-dialog v-model="FriendNoteNameVisible" title="修改好友昵称" width="500" align-center @close="Note"
        @keydown.enter="FriendNoteNameVisible = false">
        <div style="display: flex;font-size: large;justify-content: center;">
            <div style="align-content: center;">昵称:</div><el-input v-model="FriendNoteName" placeholder="修改你的好友昵称"
                style="width: 60%;"></el-input>
        </div>
        <template #footer>
            <el-button @click="FriendNoteNameVisible = false">确定</el-button>
        </template>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog v-model="SettingVisible" title="设置" width="700" align-center @close="flash"
        @key:enter="SettingVisible = false">
        <div style="margin-top: 3%;">
            <div style="display: flex;font-size: large;justify-content: center;">
                <div style="align-content: center;">用户名:</div><el-input v-model="updateUser.userName"
                    placeholder="请输入用户名" style="width: 60%;"></el-input>
            </div>
        </div>
        <div style="margin-top: 3%;margin-left: 15%;">
            <div style="font-size: large;">上传头像</div>
            <el-upload v-model:file="fileList" action="#" list-type="picture-card" :limit="1"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="UpdateUser"
                :auto-upload=false>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </div>
        <template #footer>
            <el-button @click="SettingVisible = false">确定修改</el-button>
        </template>
    </el-dialog>
    <!-- 图片放大 -->
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <!-- 背景 -->
    <div class="videoContainer">
        <video class="fullscreenVideo" id="bgVid" playsinline="true" autoplay="true" muted="true" loop="true">
            <source src="public/1.mp4" type="video/mp4">
        </video>
    </div>
    <!-- 头栏 -->
    <div class="nav">
        <img src="np.jpg" style="height: 100%;width: auto;">
        <span class="title" style="font-size: xx-large;font-weight: bolder;color: red;width: 42.5%;">牛啤网</span>
        <div style="display: flex;width: 80%;padding-right: 18.5%;height: 50%;">
            <el-autocomplete v-model="serachValue" :fetch-suggestions="querySearch" popper-class="my-autocomplete"
                :trigger-on-focus="false" clearable placeholder="请输入需要搜索的内容" style="height: 100%;"
                @keydown.enter="search" size="large">
                <template #suffix>
                    <el-icon @click="search" size="large">
                        <Search style="color: blue;" />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div class="value">{{ item.value }}</div>
                    <span class="link">{{ item.link }}</span>
                </template>
            </el-autocomplete>
        </div>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Post" class="you">发表</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="drawer = true"
            class="you">好友</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Home" class="you">主页</a-button>

        <img v-bind:src="URl">
    </div>
    <!-- 主题 -->
    <div style="display: flex;width: 100%;height: 90%;position: absolute;justify-content: center;">
        <!-- 用户信息 -->
        <div
            style="display: block;width:15%;height: 70%;background-color: rgba(255, 255, 255, 0.9);text-align: center;align-content: center;margin-top: 5%;">
            <img v-bind:src="URl" style=" width: 50%; height: auto;border-radius: 50%;margin-top: 8%;">
            <div style="font-size:xx-large;font-weight: bold;margin-top: 5%;">{{ User?.userName }}</div>
            <br>
            <div style="display: bl;font-size: large;justify-content: center;margin-top: 2%;margin-bottom: 10%;">
                <div>发表文章数</div>
                <div style="margin:3%;">{{ User?.articlesCount }}</div>
                <div>总点赞数</div>
                <div style="margin:3%;">{{ User?.totalLikes }}</div>
                <div>总评论数</div>
                <div style="margin:3%;">{{ User?.totalComments }}</div>
            </div>
            <el-divider>
                <el-icon style="color: red;"><star-filled /></el-icon>
            </el-divider>
            <a-button @click="SettingVisible = true">修改个人数据</a-button>
            <a-button @click="LoginOut">退出登陆</a-button>
        </div>
        <!-- 博客主体 -->
        <div
            style="display: block;width: 70%;height: 97.5%;background-color: rgba(255, 255, 255, 0.5);margin: 1% 2%;padding: 1% 1.5%;">
            <div style="background-color: rgba(255, 255, 255, 0.9);height: 98.5%;">
                <div style="display: flex;height: 25%;border:1px dashed;border-color:fuchsia;" v-for="b of Blogs">
                    <div style="width: 100%;margin:2% 2% 2% 2%;overflow: hidden;text-align: center;"
                        @click="details(b?.articleId, b?.author.userId)">
                        <div style="font-size: xx-large;font-weight: 900;">
                            {{ b?.articleTitle }}
                        </div>
                        <div style="font-size: smaller;color: darkgray;">
                            {{ b?.articleDateNew }}
                        </div>
                        <div
                            style="text-indent: 2em;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 7;line-height: 20px;">
                            {{ b?.articleContent }}
                        </div>
                    </div>
                    <div style="display: block;width: 7%;margin-top: auto;margin-bottom: 1%;">
                        <div style="margin-left: 20%;">
                            <div style="display: flex;align-items: center;margin-bottom: 30%;">
                                <LikeOutlined style="font-size: 30px;" class="LikeOutlined" />
                                <div>{{ b?.articleLikeCount }}</div>
                            </div>
                            <div style="display: flex;align-items: center;margin-bottom: 10%;">
                                <el-icon size="30px" color="blue">
                                    <ChatDotRound />
                                </el-icon>
                                <div>{{ b?.comments.length }}</div>
                            </div>
                        </div>
                        <a-button @click="ADelete(b?.articleId)">删除</a-button>
                    </div>
                </div>
            </div>
            <div style="display: block;width: 100%;margin-bottom: 0%;">
                <el-pagination style="justify-content: center;" v-model:current-page="nowPage" :page-size="4"
                    :disabled="disabled" layout="prev, pager, next, jumper" v-model:total="totalPages"
                    @size-change="handleSizeChange" :hide-on-single-page="true" @current-change="handleCurrentChange"
                    :background="false" />
            </div>
        </div>
    </div>
</template>