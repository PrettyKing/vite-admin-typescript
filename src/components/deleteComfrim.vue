<template>
    <teleport to='#deleteComfrim'>
        <div class="modal d-block"  tabindex="-1" v-if="dialogVisible">
            <div class="el-dialog" style="width:400px;margin-top:10vh">
                <div class="el-dialog__header">
                    <span class="el-dialog__title">提示</span>
                    <button aria-label="close" class="el-dialog__headerbtn" type="button" @click="colseModal">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div class="el-dialog__body">
                    <span style="font-size: 18px">确定删除所选数据吗？</span>
                </div>
                <div class="el-dialog__footer">
                    <span class="dialog-footer">
                        <button class="el-button el-button--default el-button--small" type="button" @click="colseModal">取 消</button>
                        <button class="el-button el-button--primary el-button--small" type="button" @click="confirmRemove">确 定</button>
                    </span>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { defineComponent } from "vue";
import { useDOMCreate} from "../hooks"

export default defineComponent({
    name: "deleteComfrim",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["colse-modal-fun", "delete-fun"],
    setup(props, context) {
        useDOMCreate("deleteComfrim")
        const confirmRemove = () => {
            context.emit("delete-fun");
        };
        const colseModal = () => {
            context.emit("colse-modal-fun");
        };
        return {
            colseModal,
            confirmRemove,
        };
    },
});
</script>