<template>
    <div style="margin-top: 20px">
        <el-page-header @back="goBack" content="Open Course Selection System">
        </el-page-header>
        <el-tag type="warning" style="margin-top: 20px; color: #00b5ad; font-size: 15px">
            <p>Warning：This selection system is only for <span class="red_color">free elective</span> courses.
            		Once the system is opened, it <span class="red_color">will not close</span> until the time setted.
            </p>
        </el-tag>
        <el-form ref="configForm" :model="configForm" label-width="120px" style="margin-top: 30px">
            <el-form-item label="Time setting" label-width="120px">
                <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        range-separator="-"
                        :picker-options="pickTimeOptions"
                        disabledDate="disabledDate"
                        start-placeholder="Open time"
                        end-placeholder="End time">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="Academy" label-width="120px">
                <el-switch
                        v-model="configForm.selectAll"
                        active-text="All"
                        inactive-text="Selected">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="configForm.selectAll === false" label="Select Academy" label-width="120px">
                <el-checkbox-group v-model="configForm.selectAcademies">
                    <el-checkbox :label="item.id" v-for="item in academies" :key="item.id">{{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="onsubmit">Finish</el-button>
                <el-button size="small" @click="goBack">Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "SelectCourseSystemConfig",
        data() {
            return {
                time: '',
                academies: '',
                configForm: {
                    startTime: '',
                    endTime: '',
                    selectAll: true,
                    selectAcademies: [],
                },
                pickTimeOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            }
        },
        watch: {
            time(v1, v2) {
                this.configForm.startTime = v1[0];
                this.configForm.endTime = v1[1];
            },
        },
        mounted() {
            this.getRequest('/web/academy/initAll').then(resp => {
                this.academies = resp.data;
            });
        },
        methods: {
            goBack() {
                this.$emit('changeName', 'CourseInfo');
            },
            onsubmit() {
                this.postKeyValueRequest('/web/openSystem/config', this.configForm).then(resp => {
                    console.log(resp);
                    if (resp.data.status === 406) {
                        if (resp.data.msg) {
                            this.$message.error(resp.data.object);
                        } else {
                            this.$message.error('Cannot open the course selection now.');
                        }
                    } else {
                    		//this.$message.success('Success, the system will be online at designated time.');
                    }
                    
                });
            },
        }
    }
</script>

<style scoped>
    .red_color {
        color: red;
    }
</style>