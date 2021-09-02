<template>
    <div class="login-container">
        <div class="login-form">
            <el-row :gutter="20">
                <el-col :lg="6" :sm="10" class="aa">
                    <h3>后台管理系统</h3>
                    <el-form status-icon :rules="FormRules" label-width="100px" class="login-ruleForm" @keyup.enter="submitForm">
                        <el-form-item label="账号" prop="account_number">
                            <el-input v-model="account_number" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm" style="width: 100%">登 录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router"
import {storage} from "@utils/localStorage/index"
import {common} from "@api/index"

export default defineComponent({
    setup() {
        const router  = useRouter()
        const account_number = ref("");
        const password = ref("");
        const FormRules = {
            account_number: [{ require:true,message:"请输入账号", trigger: "blur" }],
            password: [{ require:true,message:"请输入密码",trigger:"blur"}],
        };
        const submitForm = () => {
            if(account_number.value === ""){
                ElMessage.error("请输入账号")
            }else if(password.value === ""){
                ElMessage.error("请输入密码")
            }else{
                common.userLogin({
                    account_number:account_number.value,
                    password:password.value
                }).then(data=>{
                    storage.set("USER_TOKEN",data.data.token)
                    router.push("/home")  
                })
            }
        };
        return {
            account_number,
            password,
            submitForm,
            FormRules,
        };
    },
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label){
    color: #fff;
}
.login-container {
    background: #2d3a4b;
    width: 100%;
    height: 100%;
    position: fixed;
    display: table;
    .login-form {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        color: white;
        font-size: 18px;
        .aa {
            margin: auto;
            float: none;
        }
        h3 {
            line-height: 60px;
            margin-left: 100px;
        }
        .acount {
            text-align: left;
        }
    }
}
</style>
