<template>
    <div class="head-container clearfix">
        <div class="header-left">
            <show-aside @click="toggleClick" />
            <bread-crumb />
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="avatar-container" trigger="click">
                    <div class="avatar-wrapper">
                        <span>{{ username || "管理员" }}，你好！</span>
                        <i class="el-icon-caret-bottom" />
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu class="user-dropdown">
                            <router-link class="inlineBlock" to="/home">
                                <el-dropdown-item>首页</el-dropdown-item>
                            </router-link>
                            <el-dropdown-item divided>
                                <span style="display:block;" @click="logout">退出</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import showAside from "./showAside.vue";
import breadCrumb from "./Breadcrumb.vue";
import { useHStore } from "@/hooks";
import { useRouter } from "vue-router";
import { common } from "@api/index";
import { storage } from "@/utils/localStorage";

export default defineComponent({
    components: { showAside, breadCrumb },
    setup() {
        const { state, dispatch } = useHStore();
        const router = useRouter();
        let fullscreen = ref(false);
        let username = ref();
        const toggleClick = () => {
            dispatch("user/GET_COLLAPSE", !state.user.isCollapse);
        };
        const logout = () => {
            common.userLoginOut().then(() => {
                storage.clear();
                router.push("/login");
            });
        };
        return {
            toggleClick,
            fullscreen,
            username,
            logout,
        };
    },
});
</script>

<style lang="scss" scoped>
.head-container {
    height: 50px;
    line-height: 50px;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
        0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid #f0f0f0;
}
.header-left {
    float: left;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 50px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    margin-bottom: 10px;
}
.btn-bell {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    font-size: 24px;
    margin-right: 20px;
    margin-bottom: 15px;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: 8px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
}
.btn-bell .el-icon-bell {
    color: #666;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.avatar-container {
    height: 50px;
    display: inline-block;
    // position: absolute;
    // right: 35px;
    .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        line-height: initial;
        i {
            position: static !important;
        }

        span {
            padding: 0 10px;
        }
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
        }
        .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
        }
    }
}
</style>