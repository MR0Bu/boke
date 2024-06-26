<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from '../api/request';
import router from '../router/routers';
import { message } from "ant-design-vue";

// 路由
function Home() {
    router.push('/home')
}
function Myblog() {
    router.push('/myblog')
}

// 发表博客
const PostBlog = ref({
    content: '',
    labelNames: [''],
    title: '',
})
const submit = async () => {
    for (let index = 0; index < SelectValue.value.length; index++) {
        PostBlog.value.labelNames[index] = SelectValue.value[index][SelectValue.value[index].length - 1]
    }
    console.log(PostBlog.value)
    const resp = await axios.post(`Article/create`, PostBlog.value)
    console.log(resp.data)
    message.success('发表成功', 2)
    router.push('/myblog')
}
// 标签
const valueCount = ref(0)

const SelectValue = ref<string[]>([]);
const options = [
    {
        value: 'music',
        label: '音乐',
        children: [
            {
                value: 'Type',
                label: '类型',
                children: [
                    {
                        value: 'ballad',
                        label: '民谣',
                    },
                    {
                        value: 'popular',
                        label: '流行音乐',
                    }
                ]
            },
            {
                value: 'Languages',
                label: '语种',
                children: [
                    {
                        value: 'Cantonese',
                        label: '粤语',
                    },
                    {
                        value: 'Chinese',
                        label: '华语',
                    },
                    {
                        value: 'English',
                        label: '英语',
                    }
                ]
            }
        ]
    },
    {
        value: 'study',
        label: '学习',
        children: [
            {
                value: 'ProgrammingLanguage',
                label: '编程语言',
                children: [
                    {
                        value: 'Java',
                        label: 'Java',
                    },
                    {
                        value: 'C',
                        label: 'C',
                    },
                    {
                        value: 'Python',
                        label: 'Python',
                    }
                ]
            },
            {
                value: 'LiberalArts',
                label: '文科',
                children: [
                    {
                        value: 'Chinese',
                        label: '语文',
                    },
                    {
                        value: 'English',
                        label: '英语',
                    }
                ]
            },
            {
                value: 'Science',
                label: '理科',
                children: [
                    {
                        value: 'Mathematics',
                        label: '数学',
                    },
                    {
                        value: 'Chemistry',
                        label: '化学',
                    },
                    {
                        value: 'Creature',
                        label: '生物',
                    }
                ]
            }
        ]
    },
    {
        value: 'Games',
        label: '游戏',
        children: [
            {
                value: 'PCGames',
                label: '端游',
                children: [
                    {
                        value: 'LeagueOfLegends',
                        label: '英雄联盟',
                    },
                    {
                        value: 'Valorant',
                        label: '瓦罗兰特',
                    },
                    {
                        value: 'Counter-Strike2',
                        label: 'CS2',
                    }
                ]
            },
            {
                value: 'MobileGames',
                label: '手游',
                children: [
                    {
                        value: 'GloryOfKings',
                        label: '王者荣耀',
                    },
                    {
                        value: 'GameOfGenting',
                        label: '金铲铲',
                    }
                ]
            }
        ]
    },
    {
        value: 'Others',
        label: '其他'
    }
]
function distory() {
    console.log(valueCount.value)
    console.log(SelectValue.value[valueCount.value])
    SelectValue.value[valueCount.value] = ''
    console.log(SelectValue.value[valueCount.value])
    valueCount.value = valueCount.value - 1
}
//初始头像
const URL = ref()
//预加载
async function update() {
    //初始化头像
    if (sessionStorage.getItem('url') == null) {
        URL.value = '3.png'
    } else {
        URL.value = sessionStorage.getItem('url')
    }
}
onMounted(() => update());
</script>
<template>
    <div class="videoContainer">
        <video class="fullscreenVideo" id="bgVid" playsinline="true" autoplay="true" muted="true" loop="true">
            <source src="public/1.mp4" type="video/mp4">
        </video>
    </div>
    <div class="nav">
        <img src="np.jpg" style="height: 100%;width: auto;">
        <span class="title" style="font-size: xx-large;font-weight: bolder;color: red;width: 32%;">牛啤网</span>
        <div style="font-size: 100px;padding-right:21%;font-weight: 900;color:aqua;" class="submit">
            发表文章
        </div>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" @click="Home" class="you">返回主页</a-button>
        <a-button style="border: none;background-color: rgba(0, 0, 0, 0.2);" class="you" @click="Myblog">个人主页</a-button>
        <img v-bind:src="URL">
    </div>
    <div
        style="display: block;background-color: rgba(255, 255, 255, 0.5); margin:1% 10%;position: absolute;height: 85%;width: 80%;">
        <div style="display: block;background-color: rgba(255, 255, 255, 0.8);margin:0% 2%;height: 95%;">
            <div style="display: flex;width: 100%;margin:1%;height: 5%;">
                <div style="width: 45%;">
                    <el-button v-if="valueCount > 0" style="height: 100%;" @click="distory">-</el-button>
                    <el-cascader v-model="SelectValue[0]" :options="options" size="large" placeholder="请选择类型" />
                    <el-cascader v-model="SelectValue[1]" :options="options" size="large" placeholder="请选择类型"
                        v-if="valueCount > 0" />
                    <el-cascader v-model="SelectValue[2]" :options="options" size="large" placeholder="请选择类型"
                        v-if="valueCount > 1" />
                    <el-button v-if="valueCount < 2" style="height: 100%;"
                        @click="valueCount = valueCount + 1">+</el-button>
                </div>
                <div style="display: flex;width: 30%;">
                    <a-textarea v-model:value="PostBlog.title" placeholder="请输入你的标题" style=""></a-textarea>
                    <a-button style="font-size: large;height: 100%;" @click="submit">发表</a-button>
                </div>
            </div>
            <a-textarea v-model:value="PostBlog.content" placeholder="请输入正文"
                style="margin:0% 2%;height: 85%;width: 95%;" allowClear="true"></a-textarea>
            <div style="display: flex;justify-content: center;">

            </div>
        </div>
    </div>
</template>