<script setup lang="ts">
import router from '../router/routers';
import axios from '../api/request';
import { onMounted, ref } from "vue";
import { LikeOutlined } from '@ant-design/icons-vue';
import { StarFilled, ChatDotRound, Search } from '@element-plus/icons-vue'


//路由
function Post() {
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } {
        router.push('/post')
    }
}

function myblog() {
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {
        router.push('/myblog')
    }
}


//初始头像
const URL = ref()

//跳转详细页
async function details(BlogId: any, UserId: any) {
    // console.log(BlogId)
    // console.log(UserId)
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {
        sessionStorage.setItem("BlogId", BlogId)
        sessionStorage.setItem("UserId", UserId)
        router.push('/details')
    }
}

//作者详细页
async function authorDetail(UserId: any) {
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {

        if (sessionStorage.getItem('loginUserId') == UserId) {
            console.log(1)
            router.push("/myblog")
        } else {
            sessionStorage.setItem("UserId", UserId)
            router.push("/authorDetail")
        }
    }
}

//搜索
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
    for (let index = 0; index < value.length; index++) {
        let temp = ref({
            value: '',
            link: ''
        })
        temp.value.value = value[index]
        // console.log(temp)
        links.value[index] = temp.value
    }
    console.log(links.value)
}
const search = async () => {
    if (serachValue.value == '') {
        update()
    } else {
        const resp = await axios.post(`Article/out/getArticlesBySearch`, { keyword: serachValue.value }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        const resp1 = await axios.post(`Article/out/getArticlesBySearchSize`, { keyword: serachValue.value }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        totalPages.value = resp1.data.data
        ShowBlog.value = resp.data.data
        // console.log(ShowBlog.value)
        // console.log(resp.data.data);
    }
    console.log(serachValue.value)
}


//筛选
const keys = ref('')
const Choose = async (key: any) => {
    keys.value = key.index
    if (key.index == '') {
        update()
    } else {
        const resp = await axios.post(`Article/out/getLabels`, { labels: key.index }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        const resp1 = await axios.post(`Article/out/getLabelsSize`, { labels: key.index }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        totalPages.value = resp1.data.data
        ShowBlog.value = resp.data.data
        console.log(resp.data.data)
    }
}

//注册
const registerUser = ref({
    userName: undefined,
    registrationDate: undefined,
    userEmail: undefined,
    userId: undefined,
    userNickname: undefined,
    userPassword: undefined,
    userProfilePhoto: undefined,
    userTelephoneNumber: undefined
});

const password = ref<string>('');

const RegisterVisible = ref(false)

const SuccessRegisterVisible = ref(false)
const FailRegisterVisible = ref(false)
// 重复名检测
const DuplicateUsername = ref(false)

const RegisterCleck = async () => {
    if (registerUser.value.userPassword == password.value && registerUser.value.userName != '') {
        const resp = await axios.post(`user/register`, registerUser.value)
        if (resp.data.code == 0) {
            DuplicateUsername.value = true
        } else {
            SuccessRegisterVisible.value = true
        }
    } else {
        FailRegisterVisible.value = true
    }
}

// 登陆
const LoginVisible = ref(false)

const SuccessLoginVisible = ref(false)
const FailLoginVisible = ref(false)
//登陆用户信息
const UserDetails = ref()
const LoginCleck = async () => {
    const resp = await axios.post(`user/login`, registerUser.value)
    if (resp.data.code == 1) {
        SuccessLoginVisible.value = true
        UserDetails.value = resp.data.data
        sessionStorage.setItem('url', UserDetails.value.userProfilePhoto)
        URL.value = UserDetails.value.userProfilePhoto
        console.log(UserDetails.value)
        sessionStorage.setItem("data", resp.data.data.jwt)
    } else {
        FailLoginVisible.value = true
    }
}

//点赞改变颜色
interface colorlike {
    value: string,
    id: string,
    articleLikeCount: number
}
const LikeColor = ref<colorlike[]>([])
function colorInId(Ids: any) {
    // console.log(Ids)
    for (let index = 0; index < Ids.length; index++) {
        let temp = ref({
            value: 'black',
            id: '',
            articleLikeCount: 0
        })
        // console.log(Ids[index])
        temp.value.id = Ids[index].articleId
        temp.value.articleLikeCount = Ids[index].articleLikeCount
        LikeColor.value[index] = temp.value
    }
    console.log(LikeColor.value)
}
function ReturnColor(blogId: any) {
    for (let index = 0; index < LikeColor.value.length; index++) {
        if (LikeColor.value[index].id == blogId) {
            return LikeColor.value[index].value
        }
    }
}
async function ChangeColor(blogId: any) {
    // console.log(blogId)
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {
        for (let index = 0; index < LikeColor.value.length; index++) {
            if (LikeColor.value[index].id == blogId) {
                if (LikeColor.value[index].value == 'black') {
                    LikeColor.value[index].value = 'red'
                    LikeColor.value[index].articleLikeCount++
                    console.log(LikeColor.value)
                    // console.log(LikeColor.value[index].value)
                } else {
                    LikeColor.value[index].value = 'black'
                    LikeColor.value[index].articleLikeCount--
                    // console.log(2)
                }
            }
        }
        for (let index = 0; index < LikeColor.value.length; index++) {
            const resp = await axios.post(`Article/updateLike`, { articleid: LikeColor.value[index].id, like: LikeColor.value[index].articleLikeCount }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            console.log(resp)
        }
    }
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
    // console.log(serachValue.value)
    console.log(keys.value)
    if (keys.value != '') {
        const resp = await axios.post(`Article/out/getLabels`, { keyword: keys.value, page: val }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        ShowBlog.value = resp.data.data
    }
    else if (serachValue.value != '') {
        const resp = await axios.post(`Article/out/getArticlesBySearch`, { keyword: serachValue.value, page: val }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        ShowBlog.value = resp.data.data
        // console.log(ShowBlog.value)
    } else {
        const resp = await axios.post(`Article/out/getArticles`, { page: val }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        // console.log(resp.data.data)
        colorInId(resp.data.data)
        ShowBlog.value = resp.data.data
        // console.log(ShowBlog.value)
        const resp1 = await axios.get(`Article/out/getAllSize`)
        totalPages.value = resp1.data.data
        // console.log(resp1.data.data)
    }
}

//登录成功刷新界面
const falsh = () => {
    location.reload()
}

//请求主页博客
const RecommendedBlog = ref()
const User = ref({
    userName: '未登录用户',
    totalComments: 'x',
    articlesCount: 'x',
    totalLikes: 'x',
    userId: ''
})
const ShowBlog = ref()
//预加载
async function update() {
    //初始化头像
    if (sessionStorage.getItem('url') == null) {
        URL.value = '3.png'
    } else {
        URL.value = sessionStorage.getItem('url')
    }
    //推荐博客
    const resp = await axios.get(`Article/out/getHotTen`)
    RecommendedBlog.value = resp.data.data
    // console.log(RecommendedBlog.value)
    //主页博客
    handleCurrentChange(1)
    //检测登陆
    if (sessionStorage.getItem('data') != null) {
        const resp2 = await axios.get(`user/getUserStatistics`)
        // console.log(resp2.data)
        User.value = resp2.data.data
        sessionStorage.setItem('loginUserId', User.value.userId)
        // console.log(User.value)
    }
    //搜索框联想
    const resp3 = await axios.get(`Article/out/getAllTitle`)
    console.log(resp3.data.data)
    loadAll(resp3.data.data)
}

onMounted(() => update());
</script>
<template>
    <!-- 登陆弹窗 -->
    <div>
        <!-- 登录弹窗 -->
        <el-dialog v-model="LoginVisible" title="请登录您的账号" width="500" align-center @close="falsh()">
            <div style="display: block;width: 100%;">
                <div style="display: flex;font-size: large;justify-content: center;">
                    <div style="align-content: center;">用户名:</div><el-input v-model="registerUser.userName"
                        placeholder="请输入用户名" style="width: 60%;"></el-input>
                </div>
                <div style="display: flex;font-size: large;justify-content: center;margin-top: 3%;">
                    <div style="align-content: center;margin:0% 2%;">密码:</div><el-input
                        v-model="registerUser.userPassword" placeholder="请输入密码" style="width: 60%;" show-password
                        @keydown.enter="LoginCleck"></el-input>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RegisterVisible = true">
                        注册
                    </el-button>
                    <el-button @click="LoginVisible = false">取消</el-button>
                    <el-button type="primary" @click="LoginCleck">
                        登录
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 注册弹窗 -->
        <el-dialog v-model="RegisterVisible" title="请注册您的账号" width="500" align-center>
            <div style="display: block;width: 100%;text-align: center;">
                <div style="margin-top: 3%;">
                    <div style="display: flex;font-size: large;justify-content: center;">
                        <div style="align-content: center;">用户名:</div><el-input v-model="registerUser.userName"
                            placeholder="请输入用户名" style="width: 60%;"></el-input>
                    </div>
                    <div style="color: red;" v-if="registerUser.userName == ''">请输入用户名</div>
                </div>
                <div style="margin-top: 3%;">
                    <div style="display: flex;font-size: large;justify-content: center;">
                        <div style="align-content: center;">电话号码:</div><el-input
                            v-model="registerUser.userTelephoneNumber" placeholder="请输入用户名"
                            style="width: 60%;"></el-input>
                    </div>
                </div>
                <div style="margin-top: 3%;">
                    <div style="display: flex;font-size: large;justify-content: center;">
                        <div style="align-content: center;">邮箱:</div><el-input v-model="registerUser.userEmail"
                            placeholder="请输入用户名" style="width: 60%;"></el-input>
                    </div>
                    <div style="color: red;" v-if="registerUser.userEmail == ''">请输入邮箱</div>
                </div>

                <div style="display: flex;font-size: large;justify-content: center;margin-top: 3%;">
                    <div style="align-content: center;margin:0% 2%;">密码:</div><el-input
                        v-model="registerUser.userPassword" placeholder="请输入密码" style="width: 60%;"
                        show-password></el-input>
                </div>
                <div style="display: flex;font-size: large;justify-content: center;margin-top: 3%;">
                    <div style="align-content: center;">确定密码:</div><el-input v-model="password" placeholder="请再次输入密码"
                        style="width: 60%;" @keydown.enter="RegisterCleck"></el-input>
                </div>
                <div style="color: red;" v-show="(password != '') && (registerUser.userPassword != password)">两次密码不一致
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RegisterVisible = false" before-close>取消</el-button>
                    <el-button type="primary" @click="RegisterCleck">
                        确定注册
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 注册信息弹窗 -->
        <div>
            <el-dialog v-model="SuccessRegisterVisible" title="注意" width="200" align-center
                @close="RegisterVisible = false" @keydown.enter="SuccessRegisterVisible = false">
                <div style="text-align: center;color: red;">注册成功</div>
                <template #footer>
                    <el-button @click="SuccessRegisterVisible = false">关闭</el-button>
                </template>
            </el-dialog>
            <el-dialog v-model="FailRegisterVisible" title="注意" width="200" align-center
                @keydown.enter="FailRegisterVisible = false">
                <div style="text-align: center;color: red;">注册失败，请检查信息</div>
                <template #footer>
                    <el-button @click="FailRegisterVisible = false">关闭</el-button>
                </template>
            </el-dialog>
            <el-dialog v-model="DuplicateUsername" title="注意" width="200" align-center
                @keydown.enter="DuplicateUsername = false">
                <div style="text-align: center;color: red;">用户名重复！</div>
                <template #footer>
                    <el-button @click="DuplicateUsername = false">关闭</el-button>
                </template>
            </el-dialog>
        </div>
        <!-- 登陆信息弹窗 -->
        <div>
            <el-dialog v-model="SuccessLoginVisible" title="注意" width="200" align-center @close="LoginVisible = false"
                show-password @keydown.enter="SuccessLoginVisible = false">
                <div style="text-align: center;color: red;">登陆成功</div>
                <template #footer>
                    <el-button @click="SuccessLoginVisible = false">关闭</el-button>
                </template>
            </el-dialog>
            <el-dialog v-model="FailLoginVisible" title="注意" width="200" align-center
                @keydown.enter="FailLoginVisible = false">
                <div style="text-align: center;color: red;">登陆失败，请检查信息</div>
                <template #footer>
                    <el-button @click="FailLoginVisible = false">关闭</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
    <!-- 背景 -->
    <div class="videoContainer">
        <video class="fullscreenVideo" id="bgVid" playsinline="true" autoplay="true" muted="true" loop="true">
            <source src="public/1.mp4" type="video/mp4">
        </video>
    </div>
    <!-- 头栏 -->
    <div class="nav">
        <img src="np.jpg" style="height: 100%;width: auto;">
        <span class="title" style="font-size: xx-large;font-weight: bolder;color: red;width: 42.5%;"
            @click="update">牛啤网</span>
        <div style="display: flex;width: 80%;padding-right: 18.5%;height: 50%;">
            <el-autocomplete v-model="serachValue" :fetch-suggestions="querySearch" clearable placeholder="请输入需要搜索的内容"
                style="height: 100%;" @keydown.enter="search" size="large">
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
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="myblog" class="you">个人主页</a-button>
        <img v-bind:src="URL" @click="myblog">
    </div>
    <!-- 主要部分 -->
    <div style="display: flex;width: 100%;height: 90%;position: absolute;">
        <!-- 菜单栏 -->
        <div style="width: 10%;margin-top: 1%">
            <el-col :span="12" style="max-width: 100%;">
                <el-menu default-active="2" class="el-menu-vertical-demo" background-color="rgba(255,255,255,0.5)"
                    text-color="blue" unique-opened="true">
                    <el-menu-item @click=Choose index="">
                        <template #title>
                            <span style="font-size: larger;font-weight: 800;">全部</span>
                        </template>
                    </el-menu-item>
                    <el-sub-menu index="Music">
                        <template #title>
                            <span style="font-size: larger;font-weight: 800;">音乐</span>
                        </template>
                        <el-sub-menu index="Type">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">类型</span>
                            </template>
                            <el-menu-item @click=Choose index="ballad">民谣</el-menu-item>
                            <el-menu-item @click=Choose index="popular">流行音乐</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="Languages">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">语种</span>
                            </template>
                            <el-menu-item @click=Choose index="Cantonese">粤语</el-menu-item>
                            <el-menu-item @click=Choose index="SChinese">华语</el-menu-item>
                            <el-menu-item @click=Choose index="SEnglish">英语</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-sub-menu index="study">
                        <template #title>
                            <span style="font-size: larger;font-weight: 800;">学习</span>
                        </template>
                        <el-sub-menu index="ProgrammingLanguage">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">编程语言</span>
                            </template>
                            <el-menu-item @click=Choose index="Java">Java</el-menu-item>
                            <el-menu-item @click=Choose index="C">C</el-menu-item>
                            <el-menu-item @click=Choose index="Python">Python</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="LiberalArts">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">文科</span>
                            </template>
                            <el-menu-item @click=Choose index="Chinese">语文</el-menu-item>
                            <el-menu-item @click=Choose index="English">英语</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="Science">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">理科</span>
                            </template>
                            <el-menu-item @click=Choose index="Mathematics">数学</el-menu-item>
                            <el-menu-item @click=Choose index="Chemistry">化学</el-menu-item>
                            <el-menu-item @click=Choose index="Creature">生物</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-sub-menu index="Games">
                        <template #title>
                            <span style="font-size: larger;font-weight: 800;">游戏</span>
                        </template>
                        <el-sub-menu index="PCGames">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">端游</span>
                            </template>
                            <el-menu-item @click=Choose index="LeagueOfLegends">英雄联盟</el-menu-item>
                            <el-menu-item @click=Choose index="Valorant">瓦罗兰特</el-menu-item>
                            <el-menu-item @click=Choose index="Counter-Strike2">CS2</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="MobileGames">
                            <template #title>
                                <span style="font-size: larger;font-weight: 500;">手游</span>
                            </template>
                            <el-menu-item @click=Choose index="GloryOfKings">王者荣耀</el-menu-item>
                            <el-menu-item @click=Choose index="GameOfGenting">金铲铲</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-menu-item @click=Choose index="Others">
                        <template #title>
                            <span style="font-size: larger;font-weight: 800;">其他</span>
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <!-- 主要内容 -->
        <div
            style="display: block;width: 70%;height: 97.5%;background-color: rgba(255, 255, 255, 0.5);margin: 1% 2%;padding: 1% 1.5%;">
            <div style="background-color: rgba(255, 255, 255, 0.9);height: 98.5%;">
                <div style="display: flex;height: 25%;border:1px dashed;border-color:fuchsia;" v-for="b of ShowBlog">
                    <!-- 文章用户信息 -->
                    <div style="display: block;width: 15%;text-align: center;">
                        <img v-bind:src="b.author.userProfilePhoto" style="width:70%;border-radius: 50%;margin-top:5%;">
                        <div style="margin-top: 2%;font-size: x-large;font-weight: bold;">{{ b?.author?.userName }}
                        </div>
                        <br>
                        <a-button style="border: none;background-color:rgba(0, 0, 0, 0);"
                            @click="authorDetail(b?.author.userId)">他的主页</a-button>
                    </div>
                    <!-- 文章 -->
                    <div style="width: 100%;margin:0% 0% 2% 2%;overflow: hidden;text-align: center;"
                        @click="details(b?.articleId, b?.author.userId)">
                        <div style="font-size: xx-large;font-weight: 900;">
                            {{ b?.articleTitle }}
                        </div>
                        <div style="font-size: smaller;color: darkgray;">{{ b?.articleDateNew }}</div>
                        <div
                            style="text-indent: 2em;text-overflow:ellipsis;display: -webkit-box;-webkit-box-orient:inline-axis;">
                            {{ b?.articleContent }}
                        </div>
                    </div>
                    <div style="display: block;width: 7%;align-self: center;margin-top: auto;margin-bottom: 2%;">
                        <div style="display: flex;align-items: center;margin-bottom: 30%;">
                            <LikeOutlined style="font-size: 30px;" class="LikeOutlined"
                                @click="ChangeColor(b?.articleId)" :style="{ color: ReturnColor(b?.articleId) }" />
                            <div>{{ b?.articleLikeCount }}</div>
                        </div>
                        <div style="display: flex;align-items: center;">
                            <el-icon size="30px" color="blue">
                                <ChatDotRound />
                            </el-icon>
                            <div>{{ b?.comments.length }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: block;width: 100%;margin-bottom: 0%;">
                <el-pagination style="justify-content: center;" v-model:current-page="nowPage" :page-size="4"
                    :trigger-on-focus="false" :disabled="disabled" layout="prev, pager, next, jumper"
                    :total="totalPages" @size-change="handleSizeChange" :hide-on-single-page="true"
                    @current-change="handleCurrentChange" :background="false" />
            </div>
        </div>
        <!-- 用户信息 -->
        <div
            style="display: block;width:15%;height: 95%;background-color: rgba(255, 255, 255, 0.9);text-align: center;margin-top: 1%;">
            <img v-bind:src="URL" style=" width: 50%; height: auto;border-radius: 50%;margin-top: 8%;">
            <div style="font-size:xx-large;font-weight: bold;margin-top: 5%;">{{ User.userName }}</div>
            <br>
            <div style="display: bl;font-size: large;justify-content: center;margin-top: 2%;margin-bottom: 10%;">
                <div style="font-weight: bold;">发表文章数</div>
                <div style="margin:3%;">{{ User.articlesCount }}</div>
                <div>总点赞数</div>
                <div style="margin:3%;">{{ User.totalLikes }}</div>
                <div>总评论数</div>
                <div style="margin:3%;">{{ User.totalComments }}</div>
            </div>
            <el-divider>
                <el-icon style="color: red;"><star-filled /></el-icon>
            </el-divider>
            <!-- 推荐栏 -->
            <div>推荐</div>
            <ul style="margin-left: 10%;text-align: left;" v-for="b of RecommendedBlog">
                <li style="display: flex;">
                    <a>{{ b?.articleTitle }}</a>
                    <a style="margin-left: auto;margin-right: 20%;">点赞数:{{ b?.articleLikeCount }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>
