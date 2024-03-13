<template>
    <div style="margin-top: 30px;">
        <el-page-header @back="goBack" content="Detail Page"></el-page-header>
        <div style="margin-top: 20px"></div>
        <el-form :label-position="right" label-width="80px" :model="student" style="margin-left: 4cm;">
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="ID">
                        <el-input class="inputStyle" v-model="score.id" disabled clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Student">
                        <el-input class="inputStyle" v-model="student" clearable></el-input>
                        <el-option
                                    v-for="item in allStudents"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Course">
                        <el-input class="inputStyle" v-model="course" clearable></el-input>
                        <el-option
                                    v-for="item in allCourses"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                    </el-form-item>
                </el-col>
                
            </el-row>
            <el-col :xl="8" :xs="12">
                    <el-form-item label="Exam Time">
                        <el-date-picker
                                v-model="score.examTime"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                start-placeholder="Start Date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
           
            <el-row type="flex" class="buttonsStyle">
                <el-col :xl="2" :xs="10">
                    <el-button type="primary" plain @click="updateScoreInfo">Confirm</el-button>
                </el-col>
                <el-col :xl="2" :xs="10">
                    <el-button plain @click="goBack">Cancel</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'updateInfo',
        data() {
            return {
                score: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                student: [],
                course: [],
            }
        },
        watch: {
            scoreInfo(v1, v2) {
            },
            crouse(v1, v2) {
                console.log(v1);
            },
            student(v1, v2) {
                console.log(v1);
            },
            
            },
        mounted() {
            //initialize variables
            this.initStudentCourseScores(true);
            console.log(this.student);
        },
        computed: {
            scoreInfo() {
                this.score = JSON.parse(this.$store.state.updateScore);
            }
        },
        methods: {
            goBack() {
                this.$emit('changeName', 'scoreInfo');
            },
            initStudentCourseScores() {

        // initialization
        this.student.forEach(student => {
            student.scores = {};
            this.course.forEach(course => {
                student.scores[course.id] = 0;
            });
        }
    )},
            updateScoreInfo() {
                this.postJsonRequest('/web/scoreInfo/update', this.score).then(resp => {
                    if (resp.data.object) {
                        this.$message({
                            showClose: true,
                            message: resp.data.object,
                            type: 'error',
                            duration: 0
                        });
                    }
                })
            },
        },
    }
</script>

<style scoped>
    .inputStyle {
        width: 300px;
    }
    @media (min-width: 1920px) {
        .buttonsStyle {
            margin-left: 350px;
        }
    }
</style>