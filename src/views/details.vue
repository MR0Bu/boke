<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from '../api/request';
import router from '../router/routers';
import type { Blog } from '../model/User';
import { LikeOutlined } from '@ant-design/icons-vue';
import { StarFilled, } from '@element-plus/icons-vue'
import { message } from "ant-design-vue";

//路由
function Post() {
    sessionStorage.removeItem('UserId')
    sessionStorage.removeItem('BlogId')
    router.push('/post')
}
function Back() {
    if (sessionStorage.getItem('UserId') == sessionStorage.getItem('loginUserId')) {
        router.push('/myblog')
        sessionStorage.removeItem('BlogId')
        sessionStorage.removeItem('UserId')
    } else {
        sessionStorage.removeItem('BlogId')
        router.push('/authorDetail')
    }
}
function Home() {
    sessionStorage.removeItem('UserId')
    sessionStorage.removeItem('BlogId')
    router.push('/home')
}
function myblog() {
    if (sessionStorage.getItem('data') == null) {
        LoginVisible.value = true
    } else {
        sessionStorage.removeItem('UserId')
        sessionStorage.removeItem('BlogId')
        router.push('/myblog')
    }
}

//作者详细页
async function authorDetail() {
    if (sessionStorage.getItem('loginUserId') == sessionStorage.getItem('UserId')) {
        sessionStorage.removeItem('BlogId')
        router.push("/myblog")
    } else {
        sessionStorage.removeItem('BlogId')
        router.push("/authorDetail")
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

//发布评论
const SubmitComment = async () => {
    console.log(Comment.value)
    const resp = await axios.post(`Comment/add`, Comment.value)
    message.success("评论成功！", 2)
    console.log(resp.data);
    location.reload()
};
const Comment = ref({
    articleId: sessionStorage.getItem("BlogId"),
    commentContent: '',
})

//删除评论
async function DeleteComment(CommentId: any) {
    const resp = await axios.delete(`Comment/delete/${CommentId}`)
    message.success("删除评论成功！", 2)
    console.log(resp.data.data)
    // location.reload()
}

//点赞改变颜色
const LikeColor = ref({
    value: 'black',
    id: 0,
    articleLikeCount: 0
})
function ReturnColor() {
    return LikeColor.value.value
}
async function ChangeColor() {
    // console.log(blogId)
    if (LikeColor.value.value == 'black') {
        LikeColor.value.value = 'red'
        LikeColor.value.articleLikeCount++
        console.log(LikeColor.value)
        // console.log(LikeColor.value[index].value)
    } else {
        LikeColor.value.value = 'black'
        LikeColor.value.articleLikeCount--
        // console.log(2)
    }
    const resp = await axios.post(`Article/updateLike`, { articleid: LikeColor.value.id, like: LikeColor.value.articleLikeCount }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    console.log(resp)
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

const Blog = ref()
const User = ref()
const LoginUserId = ref()
const UserId = ref()
//初始头像
const URL = ref()
async function update() {
    //初始化头像
    if (sessionStorage.getItem('url') == null) {
        URL.value = '3.png'
    } else {
        URL.value = sessionStorage.getItem('url')
    }
    UserId.value = sessionStorage.getItem('UserId')
    LoginUserId.value = sessionStorage.getItem('loginUserId')
    const resp = await axios.get(`user/getUserStatisticsByUserId/${UserId.value}`)
    User.value = resp.data.data
    console.log(User.value)
    const BlogId = sessionStorage.getItem("BlogId")
    const resp1 = await axios.get(`Article/${BlogId}`)
    Blog.value = resp1.data.data
    LikeColor.value.id = Blog.value.articleId
    LikeColor.value.articleLikeCount = Blog.value.articleLikeCount
    console.log(Blog.value)
    //好友
    const resp2 = await axios.get(`UserFriend/getMyFriends`)
    console.log(resp2.data.data)
    friends.value = resp2.data.data
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
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);margin-left: 50%;" @click="Back"
            class="you">返回</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Post" class="you">发表</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="drawer = true"
            class="you">好友</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Home" class="you">主页</a-button>
        <img v-bind:src="URL" @click="myblog">
    </div>
    <!-- 主体 -->
    <div style="display: flex;width: 100%;height: 85%;position: absolute;justify-content: center;">
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
            <a-button style="border: none;;" @click="authorDetail()">他的主页</a-button>
        </div>
        <!-- 博客 -->
        <div
            style="display: block;width: 70%;height: 100%;background-color: rgba(255, 255, 255, 0.5);margin: 1% 2%;padding: 1% 1.5%;">
            <el-scrollbar height="800px">
                <div
                    style="display: block;position: absolute;background-color: rgba(255, 255, 255, 0.9);height: 100%;width: 100%;overflow: auto;">
                    <!-- 文章主题 -->
                    <div style="display: flex;height: 90%;margin: 2% 5%;">
                        <div style="width: 100%;margin:2% 0% 2% 2%;overflow: auto;text-align: center;">
                            <div style="font-size: 50px;font-weight: 900;">
                                {{ Blog?.articleTitle }}
                            </div>
                            <div style="font-size: smaller;color: darkgray;">
                                {{ Blog?.articleDateNew }}
                            </div>
                            <div style="text-indent: 2em;font-size: x-large;">
                                {{ Blog?.articleContent }}
                            </div>
                        </div>
                    </div>
                    <!-- 评论 -->
                    <div style="display: flex;margin: 2%;overflow: hidden;">
                        <div style="font-size: x-large;">评论区({{ Blog?.comments.length }}):
                        </div>
                        <div style="display: flex;margin-left: auto;align-items: center;">
                            <LikeOutlined style="font-size: 30px;" class="LikeOutlined" @click="ChangeColor()"
                                :style="{ color: ReturnColor() }" />
                            <div>{{ Blog?.articleLikeCount }}</div>
                        </div>
                    </div>
                    <!-- 发评论 -->
                    <div style="display: flex;margin-left: 5%;height: 8%;width: 80%;">
                        <a-textarea v-model:value="Comment.commentContent" placeholder="请输入你的评论"
                            style="width: 80%;"></a-textarea>
                        <a-button style="font-size: large;height: 100%;" @click="SubmitComment">发表</a-button>
                    </div>
                    <!-- 别人评论 -->
                    <div style="display: flex;width: 80%;margin: 2%;height: 15%;overflow: hidden;"
                        v-for="c of Blog?.comments">
                        <img v-bind:src="c?.commenter?.userProfilePhoto"
                            style=" width: 8%;border-radius: 50%;height: 70%;">
                        <div style="margin: 0% 1%;display: block;width: 100%;height: 100%;">
                            <div style="font-size:x-large;font-weight: bold;">
                                {{ c?.commenter?.userName }}
                            </div>
                            <div style="width: 100%;height: 20%;margin: 1%;">
                                {{ c?.commentContent }}
                            </div>
                            <div style="font-size: small;color: darkgray;">{{ c?.commentDateNew }}</div>
                        </div>
                        <el-button style="margin-top: auto;" @click="DeleteComment(c?.commentId)"
                            v-if="(c?.commenter?.userId == LoginUserId) || (LoginUserId == UserId)">删除</el-button>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>