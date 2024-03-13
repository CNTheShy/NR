<template>
    <!--<h1>学生个人信息查询</h1>-->
    <el-tabs style="margin-top: 10px" value="first">
        <el-tab-pane label="Personal Information" name="first">
            <div style="margin-left: 30%;margin-right: 30%">
                <el-card class="box-card">
                    <el-row>
                        <div>
                            <div>
                                <el-image class="identification_photo" :src="this.avatarUrl" alt="" style="margin-left: 40%;margin-right: 40%"/>
                            </div>
                        </div></el-row>
                    <el-divider></el-divider>
                    <div class="Info">
                        <div style="margin-top: 20px">Name:{{studentInfo.name}}</div>
                        <div style="margin-top: 20px" >ID:{{studentInfo.id}}</div>
                        <div style="margin-top: 20px">Gender:{{studentInfo.sex}}</div>
                        <div style="margin-top: 20px">Age:{{studentInfo.age}}</div>
                        <div style="margin-top: 20px">Phone:{{studentInfo.phoneNum}}</div>
                        <div style="margin-top: 20px">email:{{studentInfo.email}}</div>
                        <div style="margin-top: 20px">Identification:{{studentInfo.idCard}}</div>
                        <div style="margin-top: 20px">Nation:{{studentInfo.nation}}</div>
                    </div>
                </el-card>
            </div>
        </el-tab-pane>

        <el-tab-pane label="Course Information" name="third">
            <div style="margin-left: 100px;margin-right: 100px">
                    <el-row>
                        <br>
                        <el-table
                            :data="timetableList"
                            style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    label="Course Name">
                            </el-table-column>
                            <el-table-column
                                    prop="id"
                                    label="Section">
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="Type">
                            </el-table-column>
                            <el-table-column
                                    prop="credit"
                                    label="Credits">
                            </el-table-column>
                            <el-table-column
                                    prop="period"
                                    label="Periods">
                            </el-table-column>
                            <el-table-column
                                    prop="teacher"
                                    label="Instructor">
                            </el-table-column>
                        </el-table>
                    </el-row>
            </div>
        </el-tab-pane>

        <el-tab-pane label="Brief" name="fourth">
            <div>
                <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="18">
                    <el-card class="box-card" style="width: 500px;left: 0;right: 0;">
                        <div class="Info">
                            <div style="margin-top: 20px">ID:{{studentInfo.id}}</div>
                            <div style="margin-top: 20px">Name:{{studentInfo.name}}</div>
                            <div style="margin-top: 20px">Academy:{{studentInfo.academy.name}}</div>
                            <div style="margin-top: 20px">Major:{{studentInfo.major.name}}</div>
                            <div style="margin-top: 20px">Admission Time:{{studentInfo.createTime}}</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: "second",
        data() {
            return {
                activeName: 'StudentInfo',
                studentInfo: '',
                avatarUrl: '',
                timetableList: [],
            }
        },
        watch: {},
        mounted() {
            this.initStudents();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            initTimetable() {
            		
                this.getRequest('/web/student/courses').then(resp => {
                    console.log(resp.data);
                    this.timetableList = resp.data;
                    for (let j = 0; j < this.timetableList.length; j++) {
                        if (this.timetableList[j].status === 1) {
                            this.timetableList[j].status = 'Major Required';
                        } else if (this.timetableList[j].status === 2) {
                            this.timetableList[j].status = 'Major Elective';
                        } else if (this.timetableList[j].status === 3) {
                            this.timetableList[j].status = 'Free Elective';
                        }
                    }
                })
            },
            initStudents() {
                this.getRequest('/web/student/personalInfo').then(resp => {
                		//alert(JSON.stringify(resp));
                    this.studentInfo = resp.data;
                    
                    if (this.studentInfo.avatar === '') {
                        this.avatarUrl = require('../../assets/user_pic_middle.gif');
                    }
                    this.initTimetable();
                })
            }
        },
    }
</script>

<style scoped>
    .activeName{
        width: 100%;
        height: 100%;
    }

    .box-card {
        width: 100%;
        height: 100%;
    }

    .bg-purple {
        background-color: purple;
        color: white;
        padding: 10px;
        border-radius: 5px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .identification_photo{
        width: 120px;
        height: 140px;
        margin-left: 160px;
    }
    .Info{
        width: 100%;
        height: 100%;
        margin-left: 100px;
    }
</style>