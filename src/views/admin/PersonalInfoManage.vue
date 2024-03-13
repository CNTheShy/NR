<template>
    <div>
        <div style="margin-top: 20px;display: flex;justify-content: center">
            <el-input v-model="keywords" placeholder="Search user by ID" prefix-icon="el-icon-search"
                      style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">Search</el-button>
        </div>
        <el-container class="hr-container" v-loading="loadingFlag">
            <el-card class="hr-card" v-for="(user,index) in users" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{user.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: #e30007;" type="text"
                               icon="el-icon-delete" @click="deleteUser(user)"></el-button>
                    <!--<el-button style="float: right; padding: 3px; color: #1890ff;" type="text"
                               icon="el-icon-edit" @click="dialogForm(user)"></el-button>-->
                </div>
                <div>
                    <div class="img-container">
                        <img :src="user.avatar" :alt="user.name" :title="user.name" class="userface-img">
                    </div>
                    <div class="userinfo-container">
                        <div>ID:{{user.id}}</div>
                        <div>Name:{{user.name}}</div>
                        <div>Gender:{{user.sex}}</div>
                        <div>Phone:{{user.phoneNum}}</div>
                        <div>Status:
                            <el-switch
                                    v-model="user.enabled"
                                    active-text="Enable"
                                    @change="enabledChange(user)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    inactive-text="Disable">
                            </el-switch>
                        </div>
                        <div>Roles:
                            <el-tag type="success" style="margin-right: 4px" v-for="(role,indexj) in user.roles"
                                    :key="indexj" closable :disable-transitions="false" @close="handleClose(user, role)">{{role.description}}
                            </el-tag>
                            <el-popover
                                    placement="right"
                                    title="Roles"
                                    @show="showPop(user)"
                                    @hide="hidePop(user)"
                                    width="200"
                                    trigger="click">
                                <el-select v-model="selectedRoles" multiple placeholder="Please Choose">
                                    <el-option
                                            v-for="(r,indexk) in exceptRoles"
                                            :key="indexk"
                                            :label="r.description"
                                            :value="r.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                            </el-popover>
                        </div>
                        <div>Description:{{user.description}}</div>
                    </div>
                </div>
            </el-card>

        </el-container>
        <el-pagination background @current-change="handlePageChange" layout="prev, pager, next"
                       :page-size="8" :total="total" style="display: flex;justify-content: center"
                       :current-page.sync="currPage"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "PersonalInfoManage",
        data() {
            return {
                loadingFlag: false,
                currPage: 1,
                keywords: '',
                dialogFormVisible: false,
                total: 0,
                currUser: [],
                users: [],
                allroles: [],
                selectedRoles: [],
                exceptRoles: [],
            }
        },
        mounted() {
            this.initUsers(1, 8);
            this.initAllRoles();
        },
        methods: {
            doSearch() {
                this.initUsers(1, 8);
            },
            deleteUser(user) {
                let currUser = JSON.parse(window.localStorage.getItem('user'));
                if (currUser.id === user.id) {
                    this.$message.warning('Cannot Delete Yourself.');
                    return;
                }
                this.$confirm('Delete [' + user.name + '] perminantly?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/system/user/" + user.id).then(resp => {
                      if (resp) {
                          this.initUsers(1, 8);
                      }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Deletion Canceled.'
                    });
                });
            },
            initUsers(pageNum, pageSize) {
                this.loadingFlag = true;
                this.getRequest("/web/user/?keywords=" + this.keywords + '&pageNum=' + pageNum + '&pageSize=' + pageSize).then(resp => {
                    this.loadingFlag = false;
                    if (resp) {
                        this.users = resp.data.list;
                        this.total = resp.data.total;
                    }
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].avatar === '') {
                            this.users[i].avatar = require('../../assets/user_pic_middle.gif');
                        }
                    }
                });
            },
            initAllRoles() {
                this.getRequest("/web/user/allRoles").then(resp => {
                    if (resp) {
                        this.allroles = resp.data;
                    }
                });
            },
            enabledChange(user) {
                this.getRequest('/web/user/changeEnabled?uid=' + user.id + '&enabled=' + user.enabled).then(resp => {
                    if (resp) {
                        console.log(resp);
                    }
                });
            },
            showPop(user) {
                this.exceptRoles = [];
                console.info(this.allroles);
                let notExist = true;
                for (let i = 0; i < this.allroles.length; i++) {
                    notExist = true;
                    for (let j = 0; j < user.roles.length; j++) {
                        if (user.roles[j].id === this.allroles[i].id) {
                            notExist = false;
                            break;
                        }
                    }
                    if (notExist) {
                        this.exceptRoles.push(this.allroles[i]);
                    }
                }
            },
            hidePop(user) {
                if (this.selectedRoles.length !== 0) {
                    let roleId = [];
                    let userId = user.id;
                    let form = new FormData();
                    for (let i = 0; i < this.selectedRoles.length; i++) {
                        roleId.push(this.selectedRoles[i]);
                    }
                    form.append('userId', userId);
                    form.append('roleId', roleId);
                    this.postRequest("/web/user/addRoles", form).then(resp => {
                        if (resp) {
                            //处理user.roles添加role的信息，刷新当前页面
                            this.initUsers(this.currPage, 8);
                        }
                    });
                    //最后将selectedRoles清空
                    this.selectedRoles = [];
                }
            },
            /*dialogForm(user) {
                this.dialogFormVisible = true;
                this.currUser = JSON.parse(JSON.stringify(user))
            },*/
            handleClose(user, role) {
                //处理角色被删除
                this.deleteRequest("/web/userDeleteRole/" + user.id + "/" + role.id).then(resp => {
                    if (resp) {
                        let newRoles = [];
                        for (let i = 0; i < user.roles.length; i++) {
                            if (user.roles[i].id === role.id) {
                                console.info('Deleted ' + role.name);
                            } else {
                                newRoles.push(user.roles[i]);
                            }
                        }
                        user.roles = newRoles;
                    }
                });
            },
            /*updateUser(user){
                //修改用户信息
                console.log('Edit success');
                console.log(user);
                this
                this.dialogFormVisible = false;
            },
            cancelUpdate() {
                this.$message.info('Edit canceled.');
                this.dialogFormVisible = false;
            },*/
            handlePageChange(val) {
                this.initUsers(val, 8);
            },
        }
    }
</script>

<style>
    .userinfo-container div {
        font-size: 12px;
        color: #409eff;
    }

    .userinfo-container {
        margin-top: 20px;
    }

    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }

    .hr-container {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .hr-card {
        width: 350px;
        margin-bottom: 20px;
        margin-top: 20px;
    }
</style>