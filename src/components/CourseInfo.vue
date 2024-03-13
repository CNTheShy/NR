<template>
    <div style="margin-top: 50px;">
        <div style="margin-left: 10%">
            <el-button type="primary" size="small" @click="showSearchDialog">Search Course</el-button>
            <el-button type="info" size="small" @click="addCourseShow">Create Course</el-button>
            <el-button type="success" size="small" @click="showSelectCourseConfig">Set course selection online</el-button>
        </div>
        <el-dialog
                title="Search Course"
                :visible.sync="searchVisible"
                width="30%">
            <el-form ref="selectForm" :model="selectForm" label-width="80px">
                <el-form-item class="form-item" label="Course name" prop="name">
                    <el-input v-model="selectForm.name" clearable style="width: 220px" placeholder="Please enter course name"></el-input>
                </el-form-item>
                <el-form-item class="form-item" label="Select Academy" prop="academyId">
                    <el-select v-model="selectForm.academyId" clearable placeholder="Please select academy">
                        <el-option
                                v-for="item in academies"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="form-item" label="Type" prop="status">
                    <el-checkbox-group v-model="selectForm.status">
                        <el-checkbox label="1" name="status">Major Required</el-checkbox>
                        <el-checkbox label="2" name="status">Major Elective</el-checkbox>
                        <el-checkbox label="3" name="status">Free Elective</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item class="form-item" style="text-align: center">
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">Search</el-button>
                    <el-button @click="resetSearchForm('selectForm')">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-row style="margin-left: 10%; margin-top: 20px" type="flex">
            <el-col :span="24">
                <el-table
                        :data="courses"
                        border
                        style="width: fit-content">
                    <el-table-column
                            type="index"
                            fixed
                            width="60">
                    </el-table-column>
                    <el-table-column
                            fixed
                            prop="name"
                            label="Course Name"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="Type"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="academy.name"
                            label="Academy"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="credit"
                            label="Credits"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="total"
                            label="Max Allowed"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="period"
                            label="Period"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="Create Time"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            label="Update Time"
                            width="120">
                    </el-table-column>
                    <el-table-column label="Operation" width="230">
                        <template slot-scope="scope">
                            <el-button
                                    v-if="scope.row.status !== 'Free Elective'"
                                    type="warning"
                                    size="mini"
                                    icon="el-icon-star-off"
                                    @click="schoolScheduleConfig(scope.row)">Course Setting
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.row)">Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-pagination
                style="margin-top: 20px"
                class="align-center"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="selectForm.pageSize"
                :current-page="selectForm.currPage"
                :total="courseTotal">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "CourseManage",
        data() {
            return {
                courseTotal: 0,
                searchVisible: false,
                selectForm: {
                    name: '',
                    status: [],
                    academyId: '',
                    currPage: 1,
                    pageSize: 5,
                },
                courses: [],
                academies: [],
            }
        },
        mounted() {
            this.searchCourseData();
            this.initAcademies();
        },
        methods: {
            searchCourseData() {
                this.postJsonRequest('/web/init/courseInfo', this.selectForm).then(resp => {
                    for (let i = 0; i < resp.data.list.length; i++) {
                        this.dealData(resp.data.list[i]);
                    }
                    this.courses = resp.data.list;
                    this.courseTotal = resp.data.total;
                });
            },
            initAcademies() {
                this.getRequest('/web/academy/initAll').then(resp => {
                    this.academies = resp.data;
                });
            },
            dealData(obj) {
                if (obj.status === 1) {
                    obj.status = 'Major Required';
                } else if (obj.status === 2) {
                    obj.status = 'Major Elective';
                } else if (obj.status === 3) {
                    obj.status = 'Free Elective';
                }
            },
            handleDelete(obj) {
                this.$confirm('Delete [' + obj.name + '] perminantly?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/course/" + obj.id).then(resp => {
                        if (resp) {
                            this.searchCourseData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Deletion Canceled'
                    });
                });
            },
            onSubmit() {
                this.searchCourseData();
                this.searchVisible = false;
            },
            showSearchDialog() {
                this.searchVisible = true;
            },
            addCourseShow() {
                this.$emit('changeName', 'AddCourse');
            },
            showSelectCourseConfig() {
                this.$emit('changeName', 'SelectCourseSystemConfig');
            },
            schoolScheduleConfig(obj) {
                this.$store.state.currentCourseId = obj.id;
                this.$store.state.currentCourseName = obj.name;
                this.$emit('changeName', 'SchoolScheduleConfig');
            },
            resetSearchForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleCurrentChange(val) {
                this.selectForm.currPage = val;
                this.searchCourseData();
            }
        },
    }
</script>

<style scoped>
    .align-center {
        text-align: center;
    }
</style>