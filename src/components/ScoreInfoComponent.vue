<template>
    <div style="text-align: center">
        <h1>Score Information Management</h1>

        <el-row class="scoreTable" type="flex">
            <el-col :span="24">
                <div style="margin-top: 20px;display: flex;margin-left: 10px;">
                    <el-button type="primary" size="small" @click="selectConditionFormVisible = true">Conditional Search or
                        Export
                    </el-button>
                    <el-button type="warning" size="small" @click="insertScoreInfoVisible = true">Import Data</el-button>
                    <el-tooltip effect="dark" content="Export the Selected Score Data" placement="top-start">
                        <el-button type="info" @click="exportSelectedData" size="small" style="margin-left: 10px">Export
                            Selected
                        </el-button>
                    </el-tooltip>
                </div>
                <div style="margin-top: 15px;overflow: auto">
                    <el-table :data="scores" stripe v-loading="loadingFlag" ref="multipleTable"
                        @selection-change="handleSelectionChange"
                        style="width: fit-content;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column fixed prop="student.id" label="ID" sortable width="150">
                        </el-table-column>
                        <el-table-column prop="student.name" label="student name" sortable width="150">
                        </el-table-column>
                        <el-table-column prop="course.name" label="Course" width="180">
                        </el-table-column>
                       
                        <el-table-column prop="grade" label="Grade" sortable width="100">
                        </el-table-column>
                        <el-table-column prop="student.major.name" label="Major" width="100">
                        </el-table-column>
                        <el-table-column prop="examTime" label="Exam time" width="180">
                        </el-table-column>
                        <el-table-column prop="updateTime" label="update Time" sortable width="180">
                        </el-table-column>
                        <el-table-column label="Operations" width="150">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" size="mini">Edit</el-button>
                                <el-button @click="handleDeleteUser(scope.row)" type="danger" size="mini">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div style="display: flex;margin-top: 20px">
                    <el-button @click="toggleSelection(students)" size="small">Select All</el-button>
                    <el-button @click="toggleSelection()" size="small">Deselect</el-button>
                </div>
            </el-col>
        </el-row>

        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchForm.pageNum" :page-sizes="[3, 5, 8, 10]" :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 20px;">
        </el-pagination>

        <!-- 查询Form或者导出Form -->
        <el-dialog title="Conditional Search or Export" :visible.sync="selectConditionFormVisible" width="30%"
            :before-close="searchFormClosed">
            <el-form id="mySearchForm" :model="searchForm" ref="searchForm">
                <el-form-item label="ID" :label-width="labelWidth" prop="id">
                    <el-input class="formItem" clearable v-model="searchForm.id" placeholder="Enter ID here.."
                        auto-complete="off" style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="student name" :label-width="labelWidth" prop="student">
                    <el-input class="formItem" clearable v-model="searchForm.student" placeholder="Enter ID here.."
                        auto-complete="off" style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="Course Name" :label-width="labelWidth" prop="course">
                    <el-input class="formItem" clearable v-model="searchForm.course" placeholder="Enter course name here.."
                        auto-complete="off" style="width: 300px">
                    </el-input>
                </el-form-item>

                <el-form-item label="grade" :label-width="labelWidth" prop="grade">
                    <el-input class="formItem" clearable v-model="searchForm.grade" placeholder="Enter grade here.."
                        auto-complete="off" style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="exam name" :label-width="labelWidth" prop="name">
                    <el-input class="formItem" clearable v-model="searchForm.name" placeholder="Enter exam name here.."
                        auto-complete="off" style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="Exam Time" :label-width="labelWidth" prop="examTime">
                    <el-date-picker class="formItem" v-model="searchForm.pickTime" :picker-options="pickerOptions"
                        type="daterange" range-separator="To" value-format="yyyy-MM-dd" start-placeholder="Start date"
                        end-placeholder="End date">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="resetForm('searchForm')">Reset</el-button>
                <el-button type="info" @click="exportData">Export</el-button>
                <el-button type="primary" @click="initScores">Search</el-button>
                <el-button @click="selectConditionFormVisible = false">Cancel</el-button>
            </div>
        </el-dialog>

        <!-- 成绩信息录入过程 -->
        <el-dialog title="Import Score Data" :visible.sync="insertScoreInfoVisible" width="30%"
            :before-close="insertDialogClosed">
            <div style="text-align: left;">
                <el-steps :space="200" :active="active" finish-status="success" align-center>
                    <el-step title="Step 1" description="Choose Method"></el-step>
                    <el-step title="Step 2" description="Import Data"></el-step>
                    <el-step title="Step 3" description="Submit"></el-step>
                </el-steps>
            </div>
            <div v-if="active === 0">
                <el-button type="primary" plain size="mini" @click="changeInsertStatus(1)">Single Data</el-button>
                <el-button type="success" plain size="mini" @click="changeInsertStatus(2)">Multiple Data</el-button>
            </div>

            <!-- 单条分数数据插入 -->
            <div v-if="insertOneInfo && active === 1">
                <el-form :model="insertOneForm" ref="insertOneForm" :rules="insertOneInfoRules">
                    <el-form-item label="Student" :label-width="labelWidth" prop="studentId">
                        <el-input class="formItem" clearable v-model="insertOneForm.studentId" placeholder="Enter name here.."
                            auto-complete="off" style="width: 300px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Course" :label-width="labelWidth" prop="courseId">
                        <el-input class="formItem" clearable v-model.number="insertOneForm.courseId"
                            placeholder="Enter course here.." auto-complete="off" style="width: 300px">
                        </el-input>
                    </el-form-item>
                   
                    <el-form-item label="Grade" :label-width="labelWidth" prop="grade">
                        <el-input class="formItem" clearable v-model="insertOneForm.grade" placeholder="Enter grade here.."
                            auto-complete="off" style="width: 300px">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Exam Time" :label-width="labelWidth" prop="examTime">
                        <el-date-picker class="formItem" v-model="insertOneForm.examTime" :picker-options="pickerOptions"
                            type="date" placeholder="Select Exam Date.." value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>

            <!-- batch insert -->
            <div v-if="insertMultipleInfo && active === 1">
                <el-upload class="upload-demo" drag ref="upload" action="#" accept=".xlsx" :auto-upload="false"
                    :limit="fileLimit" :before-upload="beforeUploadFile" :on-change="fileChange" :on-exceed="exceedFile"
                    :on-success="handleSuccess" :on-remove="removeFile" :on-error="handleError"
                    :http-request="uploadScoreInfoFile" :show-file-list="true" :with-credentials="true" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">Drag a file here or <em>Click upload</em></div>
                    <div class="el-upload__tip" slot="tip">Only accept .xlsx file.</div>
                </el-upload>
            </div>
            <div v-if="active === 3 && this.errorNums > 0">
                <p>There are <span v-text="errorNums" style="color: red"></span> data segments failed to upload
                    <a href="javascript:void(0);" @click="downloadErrorFile">Click to download</a>
                </p>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="insertForwardStep" v-if="active !== 0 && active <= 2">Previous
                </el-button>
                <el-button type="primary" @click="insertNextStep('insertOneForm')" v-text="buttonInfo"
                    v-if="active >= 1"></el-button>
                <el-button @click="insertDialogClosed">Cancel</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {delScoreInfo} from "@/utils/api";

export default {
    name: 'scoreInfo',
    data() {
        return {
            errorNums: '',
            fileLimit: 2,
            fileList: [],
            loadingFlag: false,
            total: 0,
            insertOneInfo: false,
            insertMultipleInfo: false,
            buttonInfo: 'Next',
            active: 0,
            labelWidth: '120px',
            selectConditionFormVisible: false,
            insertScoreInfoVisible: false,

            insertOneForm: {
                studentId: '',
                courseId: '',
                
                grade: '',
                examTime: '',
            },
            insertOneInfoRules: {
                studentId: [
                    { required: true, message: 'Please input student name', trigger: 'blur' },
                ],
                courseId: [
                    { required: true, message: 'Please input course name', trigger: 'blur' },
                ],
                grade: [
                    { required: true, message: 'Please input grade', type: 'number' },
                ],
               
                examTime: [
                    { required: true, message: 'Please select exam time', trigger: 'blur' },
                ],

            },
            searchForm: {
                id: '',
                course: '',
                student: '',
                grade: '',
                examTime: '',
                pickTime: '',
                startTime: '',
                endTime: '',
                pageNum: 1,
                pageSize: 3,
            },
            multipleSelection: [],
            student: [],
            Course: [],
            grade: [],
            scores:[],

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
        }
    },
    mounted() {
        this.initScores();
    },
    watch: {
        'searchForm.pickTime'(newValue, oldValue) {
            if (newValue) {
                this.searchForm.startTime = newValue[0];
                this.searchForm.endTime = newValue[1];
                console.log(this.searchForm.startTime);
                console.log(this.searchForm.endTime);
            }
        },
        active(newValue, oldValue) {
            if (newValue === 2) {
                this.buttonInfo = 'Submit';
            } else if (newValue < 2) {
                this.buttonInfo = 'Next';
            } else {
                this.buttonInfo = 'Finish';
            }
        },
    },
    methods: {
        initScores() {
            this.loadingFlag = true;
            debugger
            this.postJsonRequest("/web/score/info", this.searchForm).then(resp => {
                this.loadingFlag = false;
                console.log(resp,'resp');
                if (resp) {
                    this.scores = resp.data.list;
                    this.total = resp.data.total;
                }
            });
            this.selectConditionFormVisible = false;
        },
        exportSelectedData() {
            if (this.multipleSelection.length > 0) {
                console.log(this.multipleSelection);
                const fromData = new FormData();
                const ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                console.log(ids);
                fromData.append('ids', ids);
                this.axios({
                    method: 'post',
                    url: '/web/scoreInfo/exportData/accordingId',
                    responseType: 'blob',
                    data: fromData,
                }).then(resp => {
                    const content = resp.data;
                    this.download(content, 'Part score information.xlsx');
                });
            }
        },
        exportData() {
            if (this.checkSelectInfoIsNotEmpty()) {
                this.axios({
                    method: 'post',
                    url: '/web/scoreInfo/exportData',
                    responseType: 'blob',
                    data: this.searchForm,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(resp => {
                    const content = resp.data;
                    this.download(content, 'Score information export.xlsx');
                });
            }
        },
        checkSelectInfoIsNotEmpty() {
            var flag = false;
            if (this.searchForm.id !== '' || this.searchForm.name !== '' || this.searchForm.student !== ''
                || this.searchForm.course !== '' || this.searchForm.examTime !== '') {
                flag = true;
            }
            return flag;
        },
        handleClick(row) {
            //handle edit operation
            this.$store.commit('INIT_UPDATE_SCORE', JSON.stringify(row));
            this.$emit('changeName', 'updateInfo');
        },
        handleDeleteScore(score) {
            this.$confirm('Delete [' + score.id + '] perminantly?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/web/scoreInfo/score/" + score.id).then(resp => {
                    if (resp) {
                        this.initScores();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Deletion Canceled'
                });
            });
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    console.log(row);
                    this.$refs.multipleTable.toggleRowSelection(row);
                })
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        changeInsertStatus(val) {
            if (val === 1) {
                //single score insert
                this.insertOneInfo = true;
                this.insertMultipleInfo = false;
            } else if (val === 2) {
                //batch score insert
                this.$confirm('Do you need Excel template file?', 'Warning', {
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type: 'info'
                }).then(() => {
                    axios({
                        method: 'post',
                        url: '/web/score/templateFile/download',
                        responseType: 'blob'
                    }).then(resp => {
                        const content = resp.data;
                        this.download(content, 'Grade information template.xlsx');
                    });
                }).catch(() => {

                });
                this.insertOneInfo = false;
                this.insertMultipleInfo = true;
            }
            this.active = this.active + 1;
        },
        download(content, filename) {
            const blob = new Blob([content]);
            const url = window.URL.createObjectURL(blob);
            let dom = document.createElement('a');
            dom.style.display = 'none';
            dom.href = url;
            dom.setAttribute('download', filename);
            document.body.appendChild(dom);
            dom.click();
        },
        insertDialogClosed() {
            this.active = 0;
            this.insertOneInfo = false;
            this.insertMultipleInfo = false;
            this.fileList = [];
            this.insertOneForm = {};
            this.insertScoreInfoVisible = false;
        },
        insertForwardStep() {
            this.active = this.active - 1;
        },
        insertNextStep(formName) {
            if (this.active < 2) {
                this.active = this.active + 1;
            } else if (this.active === 2) {
                this.active = this.active + 1;
                if (this.fileList.length !== 0) {
                    if (this.beforeUploadFile(this.fileList)) {
                        this.excelFilePostUpload("/web/scoreInfo/fileUpload", this.fileList).then(resp => {
                            if (resp) {
                              this.initScores();
                                this.errorNums = resp.data.object;
                                if (resp.data.object > 0) {
                                    this.$message.error("Part of the data upload failed.");
                                }
                            }
                        });
                    }
                } else {
                    if (this.insertOneForm.student !== '' && this.insertOneForm.course !== '') {
                        this.postRequest('/web/scoreInfo/upload', this.insertOneForm).then(resp => {
                            if (resp) {
                                if (resp.data.status === 406) {
                                    this.$message.error('Error occured, please chech data input!');
                                    this.active = this.active - 1;
                                }
                            }
                        });
                    } else {
                        this.$message.warning('Error in selection of student/course.');
                        this.active = this.active - 1;
                    }
                }
            } else {
                this.insertDialogClosed();
            }
        },
        downloadErrorFile() {
            this.axios({
                method: 'post',
                url: '/web/scoreInfo/errorFile',
                responseType: 'blob'
            }).then(resp => {
                const content = resp.data;
                if (content !== '') {
                    this.download(content, 'error information insert file.xlsx');
                }
                this.errorNums = 0;
            });
        },
        handleSizeChange(val) {
            this.searchForm.pageSize = val;
            this.initScores();
        },
        handleCurrentChange(val) {
            this.searchForm.pageNum = val;
            this.initScores();
        },
        resetForm(formName) {

            this.searchForm.pickTime = '';
            this.clearAllInfo();
        },


        // hook for file number over limit
        exceedFile(files, fileList) {
            this.$message.warning(`Only accept ${this.fileLimit} files, however ${files.length + fileList.length} files are choosen.`);
        },
        removeFile(file, fileList) {
            let newFileList = [];
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i] !== file) {
                    newFileList.push(fileList[i]);
                }
            }
            this.fileList = newFileList;
        },
        // hook for file status change
        fileChange(file, fileList) {
            this.fileList.push(file.raw);
        },
        beforeUploadFile(fileList) {
            let isSize = true, isExcel = true;
            for (let i = 0; i < fileList.length; i++) {
                let extension = fileList[i].name.substring(fileList[i].name.lastIndexOf('.') + 1);
                let size = fileList[i].size / 1024 / 1024;
                isSize = size < 10;
                isExcel = extension === 'xlsx';
                if (!isSize || !isExcel) {
                    break;
                }
            }
            if (!isExcel) {
                this.$message.warning('Only files whose suffix is.xlsx can be uploaded');
            }
            if (!isSize) {
                this.$message.warning('The file size must not exceed 10M');
            }
            return isSize && isExcel;
        },
        // success
        handleSuccess(res, file, fileList) {
            this.$message.success('File upload success.');
        },
        // failed
        handleError(err, file, fileList) {
            this.$message.error('File upload failed.');
        },
        uploadScoreInfoFile(params) {
          console.log('params', params)
            if (this.fileList.length === 0) {
                this.$message.warning('Please upload a file.');
            } else {
                this.excelFilePostUpload('/web/scoreInfo/fileUpload', params)
                    .then(resp => {
                        //console.log(resp);
                    });
            }
        },
        searchFormClosed() {
            this.searchForm.student = '';
            this.searchForm.course = '';
            this.searchForm.grade = '';
            this.searchForm.examTime = [];

            this.selectConditionFormVisible = false;
        },
      handleDeleteUser(row) {
        delScoreInfo(row.id).then(resp => {
          console.log(resp)
          this.initScores();
        })
      }
    }
}
</script>

<style scoped>
.formItem {
    float: left;
}

.scoreTable {
    margin-left: 1.78cm
}
</style>