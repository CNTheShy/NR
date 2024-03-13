<template>
    <div style="margin-top: 50px">
        <el-form :model="personalForm" :rules="rules" ref="personalForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="Change Avatar">
                <el-upload
                        class="avatar-uploader"
                        :http-request="uploadFile"
                        accept=".jpg, .png"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="personalForm.avatar" :src="personalForm.avatar" class="avatar" v-model="personalForm.avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input type="textarea"
                          placeholder="Write your description here..."
                          v-model="personalForm.description"
                          maxlength="50"
                          show-word-limit
                          style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('personalForm')">Apply</el-button>
                <el-button @click="resetForm('personalForm')">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Center",
        mounted() {
            let user = JSON.parse(window.localStorage.getItem('user'));
            this.personalForm.description = user.description;
            this.personalForm.avatar = user.avatar;
        },
        data() {
            return {
                personalForm: {
                    description: '',
                    avatar: '',
                },
                rules: {
                    description: [
                        {required: false, message: 'Please Enter Description.', trigger: 'blur'},
                        {min: 0, max: 50, message: 'Maximum Length 50.', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.personalForm.avatar === require('../../assets/user_pic_middle.gif')) {
                            this.personalForm.avatar = '';
                        }
                        this.postJsonRequest('/web/user/updateBaseInfo', this.personalForm).then(response => {
                            this.$store.commit('INIT_USER', JSON.stringify(response.data.object));
                        }).catch(error => {

                        });
                        location.reload();
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                var user = JSON.parse(window.localStorage.getItem('user'));
                if (user.avatar === require('../../assets/user_pic_middle.gif')) {
                    this.personalForm.avatar = require('../../assets/user_pic_middle.gif');
                } else {
                    this.personalForm.avatar = user.avatar;
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG && !isPNG) {
                    this.$message.error('Only accept .jpg/.png files.');
                }
                if (!isLt2M) {
                    this.$message.error('Maximum size 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            uploadFile(file) {
                let formData = new FormData();
                formData.append("avatar",file.file);
                //other parameters
                this.postFileRequest('/web/file/uploadAvatar', formData).then(response => {
                    this.personalForm.avatar = response.data.object.imageUrl;
                }).catch(error => {
                    this.$message.error("Fail to upload, try again later.");
                })
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>