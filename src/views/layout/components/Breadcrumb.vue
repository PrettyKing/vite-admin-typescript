<template>
    <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <transition-group name="fade-transform" mode='out-in'>
                <template v-for="item in breadList" :key="item">
                    <el-breadcrumb-item to="/">{{item}}</el-breadcrumb-item>
                </template>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>
<script>
import { computed, defineComponent } from 'vue'
import {useHStore} from "@hooks/index"

export default defineComponent({
    setup() {
        const {state} = useHStore()

        return {
            breadList:computed(()=> state.user.breadList)
        }
    },
})
</script>

<style lang="scss" scoped>
.breadcrumb {
    float: left;
    margin-left: 10px;
    margin-bottom: 0;
}
.el-breadcrumb {
    line-height: 44px;
}
</style>