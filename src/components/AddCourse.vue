<template>
    <div style="margin-top: 20px">
        <el-page-header @back="goBack" content="Create Course">
        </el-page-header>
        <el-form ref="courseForm" :model="courseForm" label-width="80px" style="margin-top: 40px;margin-left: 40px">
            <el-form-item label="Course Name" label-width="100px">
                <el-input class="form-item" clearable v-model="courseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Academy" label-width="100px">
                <el-select v-model="courseForm.academyId" clearable placeholder="Please select">
                    <el-option
                        v-for="item in academies"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Credits" label-width="100px">
                <el-input-number class="form-item" style="width: 200px"
                                 max="10" :step="0.5" min="0"
                                 clearable v-model.number="courseForm.credit"></el-input-number>
            </el-form-item>
            <el-form-item label="Class" label-width="100px">
                <el-input class="form-item" clearable v-model.number="courseForm.classId"></el-input>
            </el-form-item>
            <el-form-item label="Periods" label-width="100px">
                <el-input class="form-item" clearable v-model.number="courseForm.period"></el-input>
            </el-form-item>
            <el-form-item label="Type" label-width="100px">
                <el-radio v-model="courseForm.status" :label="1">Major Required</el-radio>
                <el-radio v-model="courseForm.status" :label="2">Major Elective</el-radio>
                <el-radio v-model="courseForm.status" :label="3">Free Elective</el-radio>
            </el-form-item>
            <div v-if="courseForm.status === 3">
                <el-form-item label="Max Enroll" label-width="100px">
                    <el-input class="form-item" clearable v-model.number="courseForm.total"></el-input>
                </el-form-item>
                <el-form-item label="Instructor" label-width="100px">
                    <el-select v-model="courseForm.teacherId"
                               filterable @visible-change="initTeacher" clearable placeholder="Please select">
                        <el-option
                                v-for="item in teachers"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="primary" size="small" @click="onSubmit">Finish</el-button>
                <el-button size="small" @click="cancel">Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "AddCourse",
        data() {
            return {
                academies: [],
                teachers: [],
                courseForm: {
                    name: '',
                    credit: '',
                    classId: '',
                    period: '',
                    status: '',
                    academyId: '',
                    total: '',
                    teacherId: '',
                }
            }
        },
        mounted() {
            this.getRequest('/web/academy/initAll').then(resp => {
                this.academies = resp.data;
            });
        },
        methods: {
            cancel() {
                this.goBack();
            },
            goBack() {
                this.$emit('changeName', 'CourseInfo');
            },
            onSubmit() {
                this.postJsonRequest('/web/add/course', this.courseForm).then(resp => {
                    if (resp.data.status === 406) {
                        this.$message.error(resp.data.object);
                    }
                });
            },
            initTeacher(flag) {
                if (flag) {
                    if (this.courseForm.academyId === '') {
                        this.$message.warning('Please select academy first.');
                    } else {
                        //initialize teachers
                        this.getRequest('/web/teacher/getByAcademyId?academyId=' + this.courseForm.academyId)
                        .then(resp => {
                            this.teachers = resp.data;
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .form-item {
        width: 300px;
    }
</style>