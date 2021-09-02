<template>
    <h1>{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <hr />
    <el-row>
        <el-button type="primary" @click="showMessge">element弹窗（Messages）</el-button>
        <el-button @click="setData">自己写的弹窗 {{ Login }}</el-button>
        <el-button type="success" @click="showModal">自己写的Modal</el-button>
        <el-button type="info" @click="setLoading">loading</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
    </el-row>
    <el-card style="width:800px;margin:30px auto;">
        <uploader action="/upload" :beforeUpload="uploadCheck" @file-uploaded="handleFileUploaded" :uploaded="uploadedData" class="d-flex align-items-center justify-content-center bg-light text-secondary w-100">
            <h2>点击上传头图</h2>
            <template #loading>
                <div class="d-flex">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <h2>正在上传</h2>
                </div>
            </template>
            <template #uploaded="dataProps">
                <div class="uploaded-area">
                    <img :src="dataProps.uploadedData.data.url">
                    <h3>点击重新上传</h3>
                </div>
            </template>
        </uploader>
    </el-card>

    <modal title="删除弹窗" :visible="modalIsVisible" @modal-on-close="modalIsVisible = false" @modal-on-confirm="hideAndDelete">
        <p>确定要删除这个吗？</p>
    </modal>
    <loader v-if="isLoading"></loader>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted } from "vue";
import { useHStore } from "../hooks/useStore";
import createMessage from "../components/message-box/createMessage";
//
import Modal from "./Modal.vue";
import Loader from "./Loader.vue";
import uploader from "./Uploader.vue";
import { beforeUploadCheck } from "../utils/index";

import { ElMessage } from "element-plus";

export default defineComponent({
    name: "HelloWorld",
    components: {
        Modal,
        Loader,
        uploader,
    },
    props: {
        msg: {
            type: String,
            required: true,
        },
    },
    setup: () => {
        const uploadedData = ref();
        const count = ref(0);
        const modalIsVisible = ref(false);
        const isLoading = ref(false);
        const store = useHStore();
        const { state, getters, dispatch } = store;
        console.log(getters);
        const setData = () => {
            // dispatch("user/SET_DATA");
            createMessage("success", "success");
        };

        onMounted(() => {});

        const showMessge = () => {
            ElMessage.success("成功拉");
        };

        const showModal = () => {
            modalIsVisible.value = true;
        };

        const hideAndDelete = () => {
            modalIsVisible.value = false;
            createMessage("删除成功", "success", 2000);
        };

        const setLoading = () => {
            isLoading.value = true;
            setTimeout(() => {
                isLoading.value = false;
            }, 3000);
        };

        const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, {
                format: ["image/jpeg", "image/png"],
                size: 1,
            });
            const { passed, error } = result;
            if (error === "format") {
                createMessage("上传图片只能是 JPG/PNG 格式!", "error");
            }
            if (error === "size") {
                createMessage("上传图片大小不能超过 1Mb", "error");
            }
            return passed;
        };

        return {
            count,
            Login: computed(() => state.user.loading),
            setData,
            showMessge,
            showModal,
            modalIsVisible,
            isLoading,
            hideAndDelete,
            setLoading,
            uploadedData,
            uploadCheck,
            handleFileUploaded: (rawData: any) => { //这里没有接口，暂且any
                console.log(rawData);
            },
        };
    },
});
</script>

<style lang="scss">
.el-card__body {
    padding: 0;
}
.file-upload-container {
    height: 200px;
    cursor: pointer;
    overflow: hidden;
}
.file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.uploaded-area {
    position: relative;
}
.uploaded-area:hover h3 {
    display: block;
}
.uploaded-area h3 {
    display: none;
    position: absolute;
    color: #999;
    text-align: center;
    width: 100%;
    top: 50%;
}
</style>
