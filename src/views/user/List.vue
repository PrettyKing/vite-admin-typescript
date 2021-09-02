<template>
    <div class="userList">
        <div class="table-title flex-wrap">
            <div>用户列表</div>
            <el-button type="danger" size="small" @click="adduser">新建用户</el-button>
        </div>

        <div class="table-box">
            <el-table :data="users.list" style="width: 100%;" :header-cell-style="{background: '#F0F0F0'}">
                <el-table-column fixed prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="name" label="昵称" width=""></el-table-column>
                <el-table-column prop="account_number" label="账号" width=""></el-table-column>
                <el-table-column prop="auth" label="权限" width=""></el-table-column>
                <el-table-column label="状态" width="">
                    <template #default="scope">
                        <span v-if="scope.row.status == '1'">正常</span>
                        <span v-if="scope.row.status == '2'">离职</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" width="">
                    <template #default="scope">
                        {{ scope.row.date }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="220">
                    <template #default="scope">
                        <el-button @click.prevent="edit(scope.row)" type="warning" plain size="small">修改</el-button>
                        <el-button @click.prevent="deleteRow(scope.row)" type="danger" plain size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="dialogTitle" v-model="outerVisible">
            <el-form class="adduserForm" ref="adduserForm" :model="addForm" size="small" label-width="86px">
                <el-form-item label="昵称:" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="账号:" prop="name">
                    <el-input v-model="addForm.account_number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="账号密码:" prop="password">
                    <el-input v-model="addForm.password" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="账号角色:">
                    <el-select v-model="addForm.auth" placeholder="请选择" @change="$forceUpdate()">
                        <el-option v-for="item in auths.list" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="addForm.status" :label="1">正常</el-radio>
                    <el-radio v-model="addForm.status" :label="2">离职</el-radio>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" size="medium" @click="addFormSubmit">提交</el-button>
                    <el-button type="danger" plain size="medium" @click="outerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <remove :dialogVisible="showRemove" @colse-modal-fun="colseModal" @delete-fun="deleteItems" />
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { user } from "@api/index";
import createMessage from "@/components/message-box/createMessage";
import Modal from "@components/Modal.vue";
import remove from "@components/deleteComfrim.vue";

export interface UserRows {
    id: never;
}

export default defineComponent({
    components: { Modal, remove },
    setup() {
        let users = reactive({ list: [] });
        let outerVisible = ref(false);
        let showRemove = ref(false);
        let addForm = reactive({
            name: "",
            account_number: "",
            password: "",
            auth: "",
            status: 1,
        });
        let auths = reactive({
            list: [],
        });
        let deleteId = reactive({ ids: [] });
        let dialogTitle = ref("新建用户");
        onMounted(() => {
            user.userTypeList().then(res => {
                auths.list = (res as any).data;
            });
            initData();
        });
        const initData = () => {
            user.userList().then(res => {
                users.list = (res as any).data.data;
            });
        };
        const adduser = () => {
            outerVisible.value = true;
            addForm.name = "";
            addForm.account_number = "";
            addForm.password = "";
            addForm.auth = "";
            addForm.status = 1;
        };
        const addFormSubmit = () => {
            user.addUser(addForm).then(() => {
                outerVisible.value = false;
                setTimeout(() => {
                    createMessage("新增成功");
                    initData();
                }, 100);
            });
        };
        const colseModal = () => {
            showRemove.value = false;
            deleteId.ids = [];
        };
        const deleteItems = () => {
            showRemove.value = false;
            user.deleteUser({ ids: deleteId.ids }).then(() => {
                setTimeout(() => {
                    createMessage("删除成功");
                    deleteId.ids = [];
                    initData();
                }, 100);
            });
        };

        const deleteRow = (rows: UserRows) => {
            deleteId.ids.push(rows.id);
            showRemove.value = true;
        };

        const edit = () => {
            console.log(1111)
        };
        return {
            users,
            adduser,
            addFormSubmit,
            colseModal,
            deleteItems,
            deleteRow,
            edit,
            outerVisible,
            dialogTitle,
            addForm,
            auths,
            showRemove,
        };
    },
});
</script>

<style lang="scss" scoped>
.table-title {
    font-size: 18px;
    color: #333;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 20px;
}
.table-box {
    padding: 20px;
}
.box {
    width: 200px;
    height: 200px;
    background: red;
}
</style>