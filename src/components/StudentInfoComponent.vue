<template>
    <div style="text-align: center">
        <h1>Student Information Management</h1>

        <el-row class="studentTable" type="flex">
            <el-col :span="24">
                <div style="margin-top: 20px;display: flex;margin-left: 10px;">
                    <el-button type="primary" size="small" @click="selectConditionFormVisible = true">Conditional Search or Export
                    </el-button>
                    <el-button type="warning" size="small" @click="insertStudentInfoVisible = true">Import Data</el-button>
                    <el-tooltip effect="dark" content="Export the Selected Student Data" placement="top-start">
                        <el-button type="info" @click="exportSelectedData" size="small" style="margin-left: 10px">Export Selected
                        </el-button>
                    </el-tooltip>
                </div>
                <div style="margin-top: 15px;overflow: auto">
                    <el-table :data="students"
                              stripe
                              v-loading="loadingFlag"
                              ref="multipleTable"
                              @selection-change="handleSelectionChange"
                              style="width: fit-content;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                fixed
                                prop="id"
                                label="ID"
                                sortable
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="Name"
                                sortable
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="sex"
                                label="Gender"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                prop="email"
                                label="Email"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="major.name"
                                label="Major"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="academy.name"
                                label="Academy"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="Admission Time"
                                sortable
                                width="200">
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

        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchForm.pageNum"
                :page-sizes="[3, 5, 8, 10]"
                :page-size="searchForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="margin-top: 20px;">
        </el-pagination>

        <!-- 查询Form或者导出Form -->
        <el-dialog title="Conditional Search or Export" :visible.sync="selectConditionFormVisible" width="30%" :before-close="searchFormClosed">
            <el-form id="mySearchForm" :model="searchForm" ref="searchForm">
                <el-form-item label="ID" :label-width="labelWidth" prop="id">
                    <el-input
                            class="formItem"
                            clearable
                            v-model="searchForm.id"
                            placeholder="Enter ID here.."
                            auto-complete="off"
                            style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="Name" :label-width="labelWidth" prop="name">
                    <el-input
                            class="formItem"
                            clearable
                            v-model="searchForm.name"
                            placeholder="Enter ID here.."
                            auto-complete="off"
                            style="width: 300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="Academy" :label-width="labelWidth">
                    <el-select class="formItem" v-model="searchForm.selectedAcademy" clearable
                               @visible-change="academySelectChange" placeholder="Select Academy here..">
                        <el-option
                                v-for="item in allAcademies"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Major" :label-width="labelWidth">
                    <el-select class="formItem" v-model="searchForm.selectedMajor" clearable
                               @visible-change="majorSelectChange"
                               placeholder="Select Major here..">
                        <el-option
                                v-for="item in allMajors"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="Time" :label-width="labelWidth">
                    <el-date-picker
                            class="formItem"
                            v-model="searchForm.pickTime"
                            :picker-options="pickerOptions"
                            type="daterange"
                            range-separator="To"
                            value-format="yyyy-MM-dd"
                            start-placeholder="Start date"
                            end-placeholder="End date">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="resetForm('searchForm')">Reset</el-button>
                <el-button type="info" @click="exportData">Export</el-button>
                <el-button type="primary" @click="initStudents">Search</el-button>
                <el-button @click="selectConditionFormVisible = false">Cancel</el-button>
            </div>
        </el-dialog>

        <!-- 学生信息录入过程 -->
        <el-dialog title="Import Student Data" :visible.sync="insertStudentInfoVisible" width="30%" :before-close="insertDialogClosed">
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
            <!-- 单条学生数据插入 -->
            <div v-if="insertOneInfo && active === 1">
                <el-form :model="insertOneForm" ref="insertOneForm" :rules="insertOneInfoRules">
                    <el-form-item label="Name" :label-width="labelWidth" prop="name">
                        <el-input
                                class="formItem"
                                clearable
                                v-model="insertOneForm.name"
                                placeholder="Enter name here.."
                                auto-complete="off"
                                style="width: 300px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Age" :label-width="labelWidth" prop="age">
                        <el-input
                                class="formItem"
                                clearable
                                v-model.number="insertOneForm.age"
                                placeholder="Enter age here.."
                                auto-complete="off"
                                style="width: 300px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Gender" :label-width="labelWidth" prop="sex">
                        <el-radio-group class="formItem" v-model="insertOneForm.sex" style="margin-top: 13px">
                            <el-radio :label="'male'">M</el-radio>
                            <el-radio :label="'female'">F</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Email" :label-width="labelWidth" prop="email">
                        <el-input
                                class="formItem"
                                clearable
                                v-model="insertOneForm.email"
                                placeholder="Enter email here.."
                                auto-complete="off"
                                style="width: 300px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Identification" :label-width="labelWidth" prop="idCard">
                        <el-input
                                class="formItem"
                                clearable
                                v-model="insertOneForm.idCard"
                                placeholder="Enter identification here.."
                                auto-complete="off"
                                style="width: 300px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Academy" :label-width="labelWidth" prop="academyId">
                        <el-select class="formItem" v-model.number="insertOneForm.academyId" clearable
                                   @visible-change="academySelectChange" placeholder="Select academy">
                            <el-option
                                    v-for="item in allAcademies"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Major" :label-width="labelWidth" prop="majorId">
                        <el-select class="formItem" v-model.number="insertOneForm.majorId" clearable
                                   @visible-change="majorSelectChange" placeholder="Select Major..">
                            <el-option
                                    v-for="item in allMajors"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Admission" :label-width="labelWidth" prop="createTime">
                        <el-date-picker
                                class="formItem"
                                v-model="insertOneForm.createTime"
                                :picker-options="pickerOptions"
                                type="date"
                                placeholder="Select Addmission Date.."
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <!-- batch insert -->
            <div v-if="insertMultipleInfo && active === 1">
                <el-upload class="upload-demo"
                           drag
                           ref="upload"
                           action="#"
                           accept=".xlsx"
                           :auto-upload="false"
                           :limit="fileLimit"
                           :before-upload="beforeUploadFile"
                           :on-change="fileChange"
                           :on-exceed="exceedFile"
                           :on-success="handleSuccess"
                           :on-remove="removeFile"
                           :on-error="handleError"
                           :http-request="uploadStudentInfoFile"
                           :show-file-list="true"
                           :with-credentials="true"
                           multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">Drag a file here or <em>Click upload</em></div>
                    <div class="el-upload__tip" slot="tip">Only accept .xlsx file.</div>
                </el-upload>
            </div>
            <div v-if="active === 3 && this.errorNums > 0">
                <p>There are <span v-text="errorNums" style="color: red"></span> data segments failed to upload
                    <a href="javascript:void(0);" @click="downloadErrorFile">Click to download</a></p>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="insertForwardStep" v-if="active !== 0 && active <= 2">Previous
                </el-button>
                <el-button type="primary" @click="insertNextStep('insertOneForm')" v-text="buttonInfo" v-if="active >= 1"></el-button>
                <el-button @click="insertDialogClosed">Cancel</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'studentInfo',
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
                insertStudentInfoVisible: false,
                insertOneForm: {
                    name: '',
                    sex: 'M',
                    age: '',
                    email: '',
                    createTime: '',
                    academyId: '',
                    majorId: '',
                    classId: '',
                    idCard: ''
                },
                insertOneInfoRules: {
                    name: [
                        {required: true, message: 'Please input name', trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: 'Please Choose gender', trigger: 'blur'},
                    ],
                    age: [
                        {required: true, message: 'Please input age', type: 'number'},
                    ],
                    email: [
                        {required: true, message: 'Please input email', trigger: 'blur'},
                    ],
                    idCard: [
                        {required: true, message: 'Please input identification', trigger: 'blur'},
                    ],
                    academyId: [
                        {required: true, message: 'Please select academy', type: 'number', trigger: 'change'},
                    ],
                    majorId: [
                        {required: true, message: 'Please select major', type: 'number', trigger: 'change'},
                    ],
                    createTime: [
                        {required: true, message: 'Please select admission date', trigger: 'blur'},
                    ]
                },
                searchForm: {
                    id: '',
                    name: '',
                    pickTime: '',
                    startTime: '',
                    endTime: '',
                    selectedAcademy: '',
                    selectedMajor: '',
                    selectedClass: '',
                    pageNum: 1,
                    pageSize: 3,
                },
                multipleSelection: [],
                allAcademies: [],
                allMajors: [],
                allClasses: [],
                students: [],
                allPoliticsStatus: [
                    {
                        value: 'student',
                        label: '1',
                    },
                    {
                        value: 'student leader',
                        label: '2',
                    },
                    {
                        value: 'professor',
                        label: '3',
                    },
                    {
                        value: 'assistant professor',
                        label: '4',
                    }
                ],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
            }
        },
        mounted() {
            this.initStudents();
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
            'searchForm.selectedMajor'(newValue, oldValue) {
            		/*
                if (newValue && this.searchForm.selectedClass !== '') {
                    this.searchForm.selectedClass = '';
                }
                */
            }
        },
        methods: {
            initStudents() {
                this.loadingFlag = true;
                this.postJsonRequest("/web/student/info", this.searchForm).then(resp => {
                    this.loadingFlag = false;
                    if (resp) {
                        this.students = resp.data.list;
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
                        url: '/web/studentInfo/exportData/accordingId',
                        responseType: 'blob',
                        data: fromData,
                    }).then(resp => {
                        const content = resp.data;
                        this.download(content, '部分学生信息文件.xlsx');
                    });
                }
            },
            exportData() {
                if (this.checkSelectInfoIsNotEmpty()) {
                    this.axios({
                        method: 'post',
                        url: '/web/studentInfo/exportData',
                        responseType: 'blob',
                        data: this.searchForm,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(resp => {
                        const content = resp.data;
                        this.download(content, '学生信息导出文件.xlsx');
                    });
                }
            },
            checkSelectInfoIsNotEmpty() {
                var flag = false;
                if (this.searchForm.id !== '' || this.searchForm.name !== '' || this.searchForm.selectedAcademy !== ''
                    || this.searchForm.selectedMajor !== ''
                    || (this.searchForm.startTime !== '' && this.searchForm.endTime !== '')) {
                    flag = true;
                }
                return flag;
            },
            handleClick(row) {
                //handle edit operation
                this.$store.commit('INIT_UPDATE_STUDENT', JSON.stringify(row));
                this.$emit('changeName', 'updateInfo');
            },
            handleDeleteUser(user) {
                this.$confirm('Delete [' + user.id + '] perminantly?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/system/user/" + user.id).then(resp => {
                        if (resp) {
                            this.initStudents();
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
                    //single insert
                    this.insertOneInfo = true;
                    this.insertMultipleInfo = false;
                } else if (val === 2) {
                    //batch insert
                    this.$confirm('Do you need Excel template file?', 'Warning', {
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'info'
                    }).then(() => {
                        axios({
                            method: 'post',
                            url: '/web/student/templateFile/download',
                            responseType: 'blob'
                        }).then(resp => {
                            const content = resp.data;
                            this.download(content, '学生信息模板.xlsx');
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
                this.insertStudentInfoVisible = false;
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
                            this.excelFilePostUpload("/web/studentInfo/fileUpload", this.fileList).then(resp => {
                                if (resp) {
                                    this.errorNums = resp.data.object;
                                    if (resp.data.object > 0) {
                                        this.$message.error("Part of the data upload failed.");
                                    }
                                }
                            });
                        }
                    } else {
                        if (this.insertOneForm.academyId !== '' && this.insertOneForm.majorId !== '') {
                            this.postRequest('/web/studentInfo/upload', this.insertOneForm).then(resp => {
                                if (resp) {
                                    if (resp.data.status === 406) {
                                        this.$message.error('Error occured, please chech data input!');
                                        this.active = this.active - 1;
                                    }
                                }
                            });
                        } else {
                            this.$message.warning('Error in selection of academy/major.');
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
                    url: '/web/studentInfo/errorFile',
                    responseType: 'blob'
                }).then(resp => {
                    const content = resp.data;
                    if (content !== '') {
                        this.download(content, '错误录入信息文件.xlsx');
                    }
                    this.errorNums = 0;
                });
            },
            handleSizeChange(val) {
                this.searchForm.pageSize = val;
                this.initStudents();
            },
            handleCurrentChange(val) {
                this.searchForm.pageNum = val;
                this.initStudents();
            },
            resetForm(formName) {
                this.searchForm.selectedAcademy = '';
                this.searchForm.selectedMajor = '';
                this.searchForm.selectedClass = '';
                this.searchForm.pickTime = '';
                this.clearAllInfo();
            },
            clearAllInfo() {
                this.allAcademies = [];
                this.allMajors = [];
                this.allClasses = [];
            },
            academySelectChange(val) {
                if (val && this.allAcademies.length === 0) {
                    this.getRequest('/web/academy/initAll').then(resp => {
                        this.allAcademies = resp.data;
                    });
                }
            },
            majorSelectChange(val) {
                if (val) {
                    if (this.searchForm.selectedAcademy === '' && this.insertOneForm.academyId === '') {
                        this.getRequest('/web/major/initAll').then(resp => {
                            this.allMajors = resp.data;
                        });
                    } else {
                        var academyId = this.searchForm.selectedAcademy !== '' ? this.searchForm.selectedAcademy : this.insertOneForm.academyId;
                        this.getRequest('/web/major/getByAcademyId?academyId=' + academyId).then(resp => {
                            this.allMajors = resp.data;
                        });
                    }
                } else {
                    if ((this.searchForm.selectedAcademy === '' && this.searchForm.selectedMajor !== '')
                        || (this.insertOneForm.academyId === '' && this.insertOneForm.majorId !== '')) {
                        var majorId = this.searchForm.selectedMajor !== '' ? this.searchForm.selectedMajor : this.insertOneForm.majorId;
                        this.getRequest('/web/academy/getByMajorId?majorId=' + majorId).then(resp => {
                            this.academySelectChange(true);
                            if (this.searchForm.selectedMajor === '') {
                                this.insertOneForm.academyId = resp.data.id;
                            } else {
                                this.searchForm.selectedAcademy = resp.data.id;
                            }
                        });
                    }
                }
            },
            classSelectChange(val) {
                if (val) {
                    if (this.searchForm.selectedMajor === '' && this.insertOneForm.majorId === '') {
                        this.$message.warning('Please select academy and major first!');
                    } else {
                        var majorId = this.searchForm.selectedMajor !== '' ? this.searchForm.selectedMajor : this.insertOneForm.majorId;
                        this.getRequest('/web/class/getByMajorId?majorId=' + majorId).then(resp => {
                            this.allClasses = resp.data;
                        });
                    }
                }
            },
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
                    this.$message.warning('Only .xlsx file is accept.');
                }
                if (!isSize) {
                    this.$message.warning('Maximum file size is 10M!');
                }
                return isSize && isExcel;
            },
            handleSuccess(res, file, fileList) {
                this.$message.success('File upload success.');
            },
            handleError(err, file, fileList) {
                this.$message.error('File upload failed.');
            },
            uploadStudentInfoFile(params) {
                if (this.fileList.length === 0) {
                    this.$message.warning('Please upload a file.');
                } else {
                    this.excelFilePostUpload('/web/studentInfo/fileUpload', params)
                        .then(resp => {
                            //console.log(resp);
                        });
                }
            },
            searchFormClosed() {
                this.searchForm.selectedMajor = '';
                this.searchForm.selectedAcademy = '';
                this.searchForm.selectedClass = '';
                this.selectConditionFormVisible = false;
            }
        }
    }
</script>

<style scoped>
    .formItem {
        float: left;
    }

    .studentTable {
        margin-left: 1.78cm
    }
</style>