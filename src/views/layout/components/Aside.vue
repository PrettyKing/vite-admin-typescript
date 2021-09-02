<template>
    <div class="aside">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="background: #304156;height:100vh">
            <el-menu :default-active="onRoutes" @select="select" router class="el-menu-vertical-demo" active-text-color="rgb(64, 158, 255)" background-color="#304156" text-color="rgb(191, 203, 217)" :collapse="isCollapse">
                <template v-for="item in asideList.list">
                    <template v-if="item.subs">
                        <el-submenu :index="item.name" :key="item.index">
                            <template #title>
                                <i :class="item.icon"></i>
                                <span>{{ item.name }}</span>
                            </template>
                            <template v-for="subItem in item.subs">
                                <el-submenu v-if="subItem.subs" :index="subItem.name" :key="subItem.index">
                                    <template #title>
                                        <i :class="subItem.icon"></i>
                                        <span>{{ subItem.name }}</span>
                                    </template>
                                    <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.name">{{threeItem.name}}</el-menu-item>
                                </el-submenu>
                                <el-menu-item v-else :index="subItem.name" :route="{name: subItem.index}" :key="subItem.index">{{ subItem.name }}</el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.name" :key="item.index" :route="{name: item.index}">
                            <i :class="item.icon"></i>
                            <span>{{ item.name }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
import { defineComponent,computed,onMounted,reactive } from 'vue'
import { useHStore } from "@hooks/useStore";
import {common} from "@api/index"
import { useRouter } from 'vue-router';

export default defineComponent({
    name:'Aside',
    setup() {
        const {state,dispatch} = useHStore();
        const router = useRouter();
        let asideList = reactive({list:[]})
        onMounted(()=>{
            common.getAsideList().then(res=>{
                asideList.list = res.data
            })
        })
        const select = (index, indexPath) => {
            // console.log(index, indexPath)
            if(index !== null){
                let baseArr = ['首页']
                baseArr.push(...indexPath);
                dispatch("user/GET_BREADLIST",baseArr)
            }

        }
        return {
            isCollapse: computed(() => state.user.isCollapse),
            asideList,
            onRoutes:'home',
            select
        }
    },
})
</script>
<style scoped>
:deep(.el-menu) {
    border-right: none;
}
</style>
<style lang="scss" scoped>
.aside {
    -webkit-transition: width 0.28s;
    transition: width 0.28s;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 180px;
        height: 100%;
        text-align: left;
    }
    .el-menu--collapse {
        height: 100%;
    }
}
</style>