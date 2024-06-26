<script setup lang="ts">
import router from '../router/routers';
import axios from '../api/request';
import { onMounted, ref } from "vue";
import { LikeOutlined } from '@ant-design/icons-vue';
import { StarFilled, ChatDotRound, Search } from '@element-plus/icons-vue'

//路由
function Post() {
    sessionStorage.removeItem('UserId')
    router.push('/post')
}
function Home() {
    sessionStorage.removeItem('UserId')
    router.push('/home')
}
function myblog() {
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {
        sessionStorage.removeItem('UserId')
        router.push('/myblog')
    }
}
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


//注册用户
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
//二次校验密码
const password = ref<string>('');
//注册弹窗
const RegisterVisible = ref(false)
//成功注册弹窗
const SuccessRegisterVisible = ref(false)
//失败注册弹窗
const FailRegisterVisible = ref(false)
// 重复名检测
const DuplicateUsername = ref(false)
//注册检测
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

const LoginCleck = async () => {
    const resp = await axios.post(`user/login`, registerUser.value)
    if (resp.data.code == 1) {
        SuccessLoginVisible.value = true
        // URL.value =
        console.log(resp.data.data)
        sessionStorage.setItem("data", resp.data.data.jwt)
    } else {
        FailLoginVisible.value = true
    }
}

//分页
const nowPage = ref(1)
const totalPages = ref(0)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
    console.log(val)
}
const handleCurrentChange = async (val: number) => {
    // console.log(val)
    const resp = await axios.post(`Article/getArticleByUserId`, { page: val, userId: sessionStorage.getItem('UserId') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    console.log(resp.data.data)
    colorInId(resp.data.data)
    Blogs.value = resp.data.data
    console.log(Blogs.value)
    const resp1 = await axios.post(`Article/getArticleByUserIdSize`, { userId: sessionStorage.getItem('UserId') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    totalPages.value = resp1.data.data
    console.log(resp1.data.data)
}

const User = ref()
const Blogs = ref()
//初始头像
const URL = ref()
async function update() {
    //初始化头像
    if (sessionStorage.getItem('url') == null) {
        URL.value = '3.png'
    } else {
        URL.value = sessionStorage.getItem('url')
    }
    const UserId = sessionStorage.getItem('UserId')
    // console.log(UserId)

    const resp = await axios.get(`user/getUserStatisticsByUserId/${UserId}`)
    // console.log(resp.data.data)
    User.value = resp.data.data
    // console.log(User.value)
    handleCurrentChange(1)
    //搜索框联想
    const resp3 = await axios.get(`Article/out/getAllTitle`)
    // console.log(resp3.data.data)
    loadAll(resp3.data.data)
}
onMounted(() => update())
</script>
<template>
    <!-- 登录弹窗 -->
    <el-dialog v-model="LoginVisible" title="请登录您的账号" width="500" align-center>
        <div style="display: block;width: 100%;">
            <div style="display: flex;font-size: large;justify-content: center;">
                <div style="align-content: center;">用户名:</div><el-input v-model="registerUser.userName"
                    placeholder="请输入用户名" style="width: 60%;"></el-input>
            </div>
            <div style="display: flex;font-size: large;justify-content: center;margin-top: 3%;">
                <div style="align-content: center;margin:0% 2%;">密码:</div><el-input v-model="registerUser.userPassword"
                    placeholder="请输入密码" style="width: 60%;" show-password @keydown.enter="LoginCleck"></el-input>
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
                    <div style="align-content: center;">账号:</div><el-input v-model="registerUser.userName"
                        placeholder="请输入用户名" style="width: 60%;"></el-input>
                </div>
                <div style="color: red;" v-if="registerUser.userName == ''">请输入账号</div>
            </div>
            <div style="margin-top: 3%;">
                <div style="display: flex;font-size: large;justify-content: center;">
                    <div style="align-content: center;">昵称:</div><el-input v-model="registerUser.userNickname"
                        placeholder="请输入用户名" style="width: 60%;"></el-input>
                </div>
                <div style="color: red;" v-if="registerUser.userNickname == ''">请输入昵称</div>
            </div>

            <div style="margin-top: 3%;">
                <div style="display: flex;font-size: large;justify-content: center;">
                    <div style="align-content: center;">电话号码:</div><el-input v-model="registerUser.userTelephoneNumber"
                        placeholder="请输入用户名" style="width: 60%;"></el-input>
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
                <div style="align-content: center;margin:0% 2%;">密码:</div><el-input v-model="registerUser.userPassword"
                    placeholder="请输入密码" style="width: 60%;" show-password></el-input>
            </div>
            <div style="display: flex;font-size: large;justify-content: center;margin-top: 3%;">
                <div style="align-content: center;">确定密码:</div><el-input v-model="password" placeholder="请再次输入密码"
                    style="width: 60%;" @keydown.enter="RegisterCleck"></el-input>
            </div>
            <div style="color: red;" v-show="(password != '') && (registerUser.userPassword != password)">两次密码不一致</div>
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
        <el-dialog v-model="SuccessRegisterVisible" title="注意" width="200" align-center @close="RegisterVisible = false"
            @keydown.enter="SuccessRegisterVisible = false">
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
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Home" class="you">主页</a-button>

        <img v-bind:src="URL" @click="myblog">
    </div>
    <!-- 主体 -->
    <div style="display: flex;width: 100%;height: 90%;position: absolute;justify-content: center;">
        <!-- 用户信息 -->
        <div
            style="display: block;width:15%;height: 70%;background-color: rgba(255, 255, 255, 0.9);text-align: center;align-content: center;margin-top: 5%;">
            <img v-bind:src="User?.userProfilePhoto"
                style=" width: 50%; height: auto;border-radius: 50%;margin-top: 8%;">
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
        </div>
        <!-- 博客 -->
        <div
            style="display: block;width: 70%;height: 97.5%;background-color: rgba(255, 255, 255, 0.5);margin: 1% 2%;padding: 1% 1.5%;">
            <div style="background-color: rgba(255, 255, 255, 0.9);height: 98.5%;">
                <div style="display: flex;height: 25%;border:1px dashed;border-color:fuchsia;" v-for="b of Blogs">
                    <!-- 文章 -->
                    <div style="width: 100%;margin:2% 0% 2% 2%;overflow: hidden;text-align: center;"
                        @click="details(b?.articleId, b?.author.userId)">
                        <div style="font-size: xx-large;font-weight: 900;">
                            {{ b?.articleTitle }}
                        </div>
                        <div style="font-size: smaller;color: darkgray;">{{ b?.articleDateNew }}</div>
                        <div
                            style="text-indent: 2em;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 7;line-height: 20px;">
                            {{ b?.articleContent }}
                        </div>
                    </div>
                    <!-- 点赞评论 -->
                    <div style="display: block;width: 7%;align-self: center;height: 100%;">
                        <div style="display: flex;align-items: center;margin-bottom: 30%;margin-top: 100%;">
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
                    :disabled="disabled" layout="prev, pager, next, jumper" v-model:total="totalPages"
                    @size-change="handleSizeChange" :hide-on-single-page="true" @current-change="handleCurrentChange"
                    :background="false" />
            </div>
        </div>
    </div>
</template>