<template>
    <div style="margin-top: 20px">
        <el-page-header @back="goBack" content="School Schedule Config">
        </el-page-header>
        <el-form ref="scheduleConfigForm" :model="scheduleConfigForm" label-width="80px"
                 style="margin-top: 30px; margin-left: 40px">
            <el-form-item label="Course Name" label-width="180px">
                <label v-text="currCourseName" style="font-size: 24px"></label>
            </el-form-item>
            
            <el-row style="margin-left: 10%; margin-top: 20px" type="flex">
            <el-col :span="24">
                <el-table
                        :data="classes"
                        border
                        style="width: fit-content">
                    <el-table-column
                            type="index"
                            fixed
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="ID"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            fixed
                            prop="name"
                            label="Course Name"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="count"
                            label="Enrolled"
                            width="120">
                    </el-table-column>
                    <el-table-column label="Operation" width="230">
                        <template slot-scope="scope">
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
            
            <el-form-item label="Select Teacher" label-width="120px" style="margin-top: 20px">
                <el-cascader
                        v-model="selectTeacher"
                        :options="academyTeacherInfo"
                        :props="teacherProps"
                        clearable
                        style="width: 400px"
                        @change="handleTeacherChange"></el-cascader>
            </el-form-item>
            <el-form-item label="Select Class" label-width="120px">
                <el-cascader
                        v-model="selectClasses"
                        :options="allClassesInfo"
                        :props="classInfoProps"
                        clearable
                        style="width: 400px"
                        @change="handleClassChange"></el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="onSubmit">Set Teacher</el-button>
                <el-button size="small" @click="cancel">Cancle</el-button>
                <el-button type="primary" size="small" @click="addNewClass">Add a new Class</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "SchoolScheduleConfig",
        data() {
              return {
              		classes: [],
                  currCourseName: '',
                  selectTeacher: [],
                  selectClasses: [],
                  classInfoProps: {
                      value: 'id',
                      label: 'id',
                      children: 'classes',
                  },
                  teacherProps: {
                      value: 'id',
                      label: 'name',
                      children: 'teachers',
                  },
                  allSchoolInfo: [],
                  allClassesInfo: [],
                  allCourses: [],
                  academyTeacherInfo: [],
                  scheduleConfigForm: {
                      classId: '',
                      courseId: '',
                      teacherId: '',
                  }
              }
        },
        mounted() {
            this.currCourseName = this.$store.state.currentCourseName;
            this.scheduleConfigForm.courseId = this.$store.state.currentCourseId;
            this.searchClassData();
            this.getRequest('/web/school/details').then(resp => {
                this.allSchoolInfo = resp.data;
            });
            this.getRequest('/web/academy/teacherInfo').then(resp => {
                this.academyTeacherInfo = resp.data;
            });
        },
        methods: {
        		searchClassData(){
        				this.getRequest('/web/courseInfo/classes?courseId=' + this.scheduleConfigForm.courseId).then(resp => {
										this.classes = resp.data;
										this.allClassesInfo = resp.data;
            });
        		},
            cancel() {
                this.goBack();
            },
            goBack() {
                this.$emit('changeName', 'CourseInfo');
            },
            handleClassChange(value) {
                if (value.length > 0) {
                    this.scheduleConfigForm.classId = value[0];
                } else {
                    this.scheduleConfigForm.classId = '';
                }
            },
            handleTeacherChange(value) {
                if (value.length > 0) {
                    this.scheduleConfigForm.teacherId = value[1];
                } else {
                    this.scheduleConfigForm.teacherId = '';
                }
            },
            addNewClass() {
                this.postJsonRequest('/web/course/newClass?courseId=' + this.scheduleConfigForm.courseId).then(resp => {
                		if (resp.data.status === 406) {
                        this.$message.error(resp.data.object);
                    }
                    this.searchClassData();
                })
            },
            handleDelete(obj) {
                this.$confirm('Delete this class perminantly?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/class/" + obj.id + "/" + this.scheduleConfigForm.courseId).then(resp => {
                        if (resp) {
                            this.searchClassData();
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
                this.postJsonRequest('/web/schedule/courseConfig', this.scheduleConfigForm).then(resp => {})
            },
            initTeacher(value) {
                if (value) {
                    alert(1);
                }
            }
        },
    }
</script>

<style scoped>

</style>