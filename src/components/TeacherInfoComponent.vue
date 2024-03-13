<template>
    <div style="text-align: center">
        <h1>Teacher Information Management</h1>

        <el-row class="teacherTable" type="flex">
            <el-col :span="24">
                <div style="margin-top: 20px;display: flex;margin-left: 10px;">
                    <el-button type="primary" size="small" @click="selectConditionFormVisible = true">Conditional Search
                    </el-button>
                    <el-button type="warning" size="small" @click="insertTeacherInfoVisible = true">Import Data</el-button>
                </div>
                <div style="margin-top: 15px;overflow: auto">
                    <el-table :data="teachers"
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
        <el-dialog title="Conditional Search" :visible.sync="selectConditionFormVisible" width="30%" :before-close="searchFormClosed">
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
                <el-button type="primary" @click="initTeachers">Search</el-button>
                <el-button @click="selectConditionFormVisible = false">Cancel</el-button>
            </div>
        </el-dialog>

        <!-- 学生信息录入过程 -->
        <el-dialog title="Import Teacher Data" :visible.sync="insertTeacherInfoVisible" width="30%" :before-close="insertDialogClosed">
            <div style="text-align: left;">
                <el-steps :space="200" :active="active" finish-status="success" align-center>
                    <el-step title="Step 1" description="Choose Method"></el-step>
                    <el-step title="Step 2" description="Import Data"></el-step>
                    <el-step title="Step 3" description="Submit"></el-step>
                </el-steps>
            </div>
            <div v-if="active === 0">
                <el-button type="primary" plain size="mini" @click="changeInsertStatus(1)">Single Data</el-button>
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
                    <el-form-item label="Gender" :label-width="labelWidth" prop="sex">
                        <el-radio-group class="formItem" v-model="insertOneForm.sex" style="margin-top: 13px">
                            <el-radio :label="'Male'">M</el-radio>
                            <el-radio :label="'Female'">F</el-radio>
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
                    <el-form-item label="Entry" :label-width="labelWidth" prop="createTime">
                        <el-date-picker
                                class="formItem"
                                v-model="insertOneForm.createTime"
                                :picker-options="pickerOptions"
                                type="date"
                                placeholder="Select Entry Date.."
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 批量学生数据插入 -->
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
        name: 'teacherInfo',
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
                insertTeacherInfoVisible: false,
                insertOneForm: {
                    name: '',
                    sex: 'M',
                    email: '',
                    createTime: '',
                    academyId: '',
                    idCard: ''
                },
                insertOneInfoRules: {
                    name: [
                        {required: true, message: 'Please input name', trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: 'Please Choose gender', trigger: 'blur'},
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
                    pageNum: 1,
                    pageSize: 3,
                },
                multipleSelection: [],
                allAcademies: [],
                allMajors: [],
                allClasses: [],
                teachers: [],
                allPoliticsStatus: [
                    {
                        value: '群众',
                        label: '1',
                    },
                    {
                        value: '共青团员',
                        label: '2',
                    },
                    {
                        value: '中共党员',
                        label: '3',
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
            this.initTeachers();
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
                if (newValue && this.searchForm.selectedClass !== '') {
                    this.searchForm.selectedClass = '';
                }
            }
        },
        methods: {
            initTeachers() {
                this.loadingFlag = true;
                this.postJsonRequest("/web/teacher/info", this.searchForm).then(resp => {
                    this.loadingFlag = false;
                    if (resp) {
                        this.teachers = resp.data.list;
                        this.total = resp.data.total;
                    }
                });
                this.selectConditionFormVisible = false;
            },
            checkSelectInfoIsNotEmpty() {
                var flag = false;
                if (this.searchForm.id !== '' || this.searchForm.name !== '' || this.searchForm.selectedAcademy !== ''
                    || this.searchForm.selectedMajor !== '' || this.searchForm.selectedClass !== ''
                    || (this.searchForm.startTime !== '' && this.searchForm.endTime !== '')) {
                    flag = true;
                }
                return flag;
            },
            handleClick(row) {
                //处理编辑动作
                this.$store.commit('INIT_UPDATE_TEACHER', JSON.stringify(row));
                this.$emit('changeName', 'updateInfo');
            },
            handleDeleteUser(user) {
                this.$confirm('Delete [' + user.id + '] perminantly？', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/system/user/" + user.id).then(resp => {
                        if (resp) {
                            this.initTeachers();
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
                    //学生信息单条的录入
                    this.insertOneInfo = true;
                    this.insertMultipleInfo = false;
                }
                this.active = this.active + 1;
            },
            insertDialogClosed() {
                this.active = 0;
                this.insertOneInfo = false;
                this.insertMultipleInfo = false;
                this.fileList = [];
                this.insertOneForm = {};
                this.insertTeacherInfoVisible = false;
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
                        if (this.insertOneForm.academyId !== '') {
                            this.postRequest('/web/teacher/upload', this.insertOneForm).then(resp => {
                                if (resp) {
																		alert(JSON.stringify(resp));
                                    if (resp.data.status === 406) {
                        								alert(JSON.stringify(this.insertOneForm));
                                        this.$message.error('Error occured, please chech data input!');
                                        this.active = this.active - 1;
                                    }
                                }
                            });
                            
                        } else {
                            this.$message.warning('Error in selection of academy.');
                            this.active = this.active - 1;
                        }
                    }
                } else {
                    this.insertDialogClosed();
                }
            },
            handleSizeChange(val) {
                this.searchForm.pageSize = val;
                this.initTeachers();
            },
            handleCurrentChange(val) {
                this.searchForm.pageNum = val;
                this.initTeachers();
            },
            resetForm(formName) {
                this.searchForm.selectedAcademy = '';
                this.searchForm.pickTime = '';
                this.clearAllInfo();
            },
            clearAllInfo() {
                this.allAcademies = [];
            },
            academySelectChange(val) {
                if (val && this.allAcademies.length === 0) {
                    this.getRequest('/web/academy/initAll').then(resp => {
                        this.allAcademies = resp.data;
                    });
                }
            },
            searchFormClosed() {
                this.searchForm.selectedAcademy = '';
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