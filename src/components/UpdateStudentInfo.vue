<template>
    <div style="margin-top: 30px;">
        <el-page-header @back="goBack" content="Detail Page"></el-page-header>
        <div style="margin-top: 20px"></div>
        <el-form :label-position="right" label-width="80px" :model="student" style="margin-left: 4cm;">
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="ID">
                        <el-input class="inputStyle" v-model="student.id" disabled clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Name">
                        <el-input class="inputStyle" v-model="student.name" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Nation">
                        <el-input class="inputStyle" v-model="student.nation" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Academy">
                        <el-select v-model="student.academy.id" clearable
                                   @visible-change="academySelectChange" placeholder="Please select academy..">
                            <el-option
                                    v-for="item in allAcademies"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Gender">
                        <el-radio v-model="student.sex" label="male">M</el-radio>
                        <el-radio v-model="student.sex" label="female">F</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Major">
                        <el-select v-model="student.major.id" clearable
                                   @visible-change="majorSelectChange"
                                   placeholder="Please choose major..">
                            <el-option
                                    v-for="item in allMajors"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Age">
                        <el-input class="inputStyle" v-model.number="student.age" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Group">
                        <el-select v-model="student.classes.id" clearable
                                   @visible-change="classSelectChange" placeholder="Please choose group..">
                            <el-option
                                    v-for="item in allClasses"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Type">
                        <el-select v-model="student.politicsStatus" placeholder="Please choose">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :xs="12">
                    <el-form-item label="Admission Date">
                        <el-date-picker
                                v-model="student.createTime"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                start-placeholder="Start Date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="Identification" style="justify-content: center">
                <el-input class="inputStyle" v-model="student.idCard" clearable></el-input>
            </el-form-item>
            <el-form-item label="Contact Number">
                <el-input class="inputStyle" v-model="student.phoneNum" clearable></el-input>
            </el-form-item>
            <el-form-item label="Email">
                <el-input class="inputStyle" v-model="student.email" clearable></el-input>
            </el-form-item>
            <el-row type="flex" class="buttonsStyle">
                <el-col :xl="2" :xs="10">
                    <el-button type="primary" plain @click="updateStudentInfo">Confirm</el-button>
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
                student: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                options: [{
                    value: 'student',
                    label: '1'
                }, {
                    value: 'student leader',
                    label: '2'
                }, {
                    value: 'professor',
                    label: '3'
                },
                {
                    value:'assistant professor',
                    label:'4'
                }
            ],
                allAcademies: [],
                allMajors: [],
                allClasses: [],
            }
        },
        watch: {
            studentInfo(v1, v2) {
            },
            allClasses(v1, v2) {
                console.log(v1);
            },
            'student.major.id'(v1, v2) {
                this.student.classes.id = '';
            },
            'student.academy.id'(v1, v2) {
                this.student.major.id = '';
                this.student.classes.id = '';
            }
        },
        mounted() {
            //initialize variables
            this.academySelectChange(true);
            this.majorSelectChange(true);
            this.classSelectChange(true);
            console.log(this.student.classes);
        },
        computed: {
            studentInfo() {
                this.student = JSON.parse(this.$store.state.updateStudent);
            }
        },
        methods: {
            goBack() {
                this.$emit('changeName', 'studentInfo');
            },
            academySelectChange(val) {
                if (val && this.allAcademies.length <= 1) {
                    this.getRequest('/web/academy/initAll').then(resp => {
                        this.allAcademies = resp.data;
                    });
                }
            },
            majorSelectChange(val) {
                if (val) {
                    if (this.student.academy.id === '') {
                        this.getRequest('/web/major/initAll').then(resp => {
                            this.allMajors = resp.data;
                        });
                    } else {
                        this.getRequest('/web/major/getByAcademyId?academyId=' + this.student.academy.id).then(resp => {
                            this.allMajors = resp.data;
                        });
                    }
                } else {
                    if (this.student.academy.id === '' && this.student.major.id !== '') {
                        this.getRequest('/web/academy/getByMajorId?majorId=' + this.student.major.id).then(resp => {
                            this.academySelectChange(true);
                            this.student.academy.id = resp.data.id;
                        });
                    }
                }
            },
            classSelectChange(val) {
                if (val) {
                    if (this.student.academy.id === '' && this.student.major.id === '') {
                        this.$message.warning('Please select academy and major first');
                    } else {
                        this.getRequest('/web/class/getByMajorId?majorId=' + this.student.major.id).then(resp => {
                            this.allClasses = resp.data;
                        });
                    }
                }
            },
            updateStudentInfo() {
                this.postJsonRequest('/web/studentInfo/update', this.student).then(resp => {
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
        }
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