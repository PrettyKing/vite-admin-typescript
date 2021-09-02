<template>
    <div class="wrapper">
        <Aside />
        <div class="main-container" :class="isCollapse==true?'container_collapse':''">
            <Header />
            <div class="container">
                <el-scrollbar wrap-class="scrollbar-wrapper">
                    <div class="contents">
                        <router-view v-if="isRouterAive"></router-view>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, provide, ref } from "vue";
import HelloWorld from "@components/HelloWorld.vue";
import Aside from "./components/Aside.vue";
import Header from "./components/Header.vue";
import { useHStore } from "@hooks/useStore";

export default defineComponent({
    components: { HelloWorld, Aside, Header },
    setup() {
        const { state } = useHStore();
        let isRouterAive = ref(true);

        provide("reload", () => {
            isRouterAive.value = false;
            nextTick(() => {
                isRouterAive.value = true;
            });
        });

        return {
            isCollapse: computed(() => state.user.isCollapse),
            isRouterAive,
        };
    },
});
</script>
<style lang="scss" scoped>
.wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
        min-height: 100%;
        -webkit-transition: margin-left 0.28s;
        transition: margin-left 0.28s;
        margin-left: 180px;
        position: relative;
        .container {
            height: calc(100vh - 50px);
            position: relative;
            overflow: hidden;
            background: #f0f0f0;
            width: 100%;
            overflow: hidden;
            max-width: 100vw;
            .contents {
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin: 20px 0;
                background: #fff;
                height: calc(100vh - 100px);
                border-radius: 5px;
            }
        }
    }
    .container_collapse {
        margin-left: 64px;
    }
}
</style>