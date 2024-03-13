<template>
    <div style="margin-top: 30px;margin-left: 30px;">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-button type="danger" v-if="currentName !== ''" size="small" @click="changeName('')">Back
                </el-button>
                <el-button type="primary" v-if="currentName === ''" size="small" @click="changeName('AddBoardContent')">
                    New Notification
                </el-button>
            </el-col>
            <el-col :span="12" v-if="currentName === ''">
                <el-input v-model="keywords" placeholder="Please enter a title.." style="width: 300px" @keydown.enter.native="doSearch"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="doSearch" style="margin-left: 15px">Search
                </el-button>
            </el-col>
        </el-row>
        <component v-bind:is="currentName" @changeName="changeName"></component>
        <div class="table" v-if="currentName === ''" style="margin-top: 20px; margin-left: 55px">
            <el-table
                    :data="tableData"
                    border
                    style="width: fit-content">
                <el-table-column
                        type="index"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="typeName"
                        label="Type"
                        :width="columnWidth">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="Title"
                        :width="columnWidth">
                </el-table-column>
                <el-table-column
                        label="Status"
                        :width="columnWidth">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.published"
                                active-text="Show"
                                inactive-text="Hidden"
                                @change="publishedSwitch(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="Time Created"
                        :width="columnWidth">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="Time Updated"
                        :width="columnWidth">
                </el-table-column>
                <el-table-column
                        label="Operations"
                        width="150">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.row)">Edit
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row)">Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="currentName === ''" class="block" style="position: absolute; left: 38%;margin-top: 20px">
            <el-pagination
                    layout="prev, pager, next"
                    :total="boardsTotal"
                    :page-size="5"
                    :current-page="currPage"
                    @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import AddBoardContent from "../../components/AddBoardContent";

    export default {
        name: "PublishBoard",
        data() {
            return {
                boardsTotal: 1,
                currPage: 1,
                keywords: '',
                currentName: '',
                tableData: [],
                columnWidth: 180,
            }
        },
        components: {
            AddBoardContent
        },
        watch: {},
        mounted() {
            this.initTableData('');
        },
        methods: {
            handleCurrentChange(val) {
                this.currPage = val;
                this.initTableData(this.keywords);
            },
            initTableData(keyword) {
                this.getRequest('/web/init/board?keyword=' + keyword + '&currPage=' + this.currPage + '&pageSize=' + 5).then(resp => {
                    console.log(resp.data);
                    if (resp) {
                        this.boardsTotal = resp.data.total;
                        this.tableData = resp.data.list;
                    }
                });
            },
            doSearch() {
                //处理搜索逻辑
                this.initTableData(this.keywords);
            },
            changeName(name) {
                this.currentName = name;
                if (name === '') {
                    this.initTableData('');
                    this.$store.commit('REMOVE_CURRENT_BOARD_ID');
                }
            },
            handleEdit(obj) {
                this.currentName = 'AddBoardContent';
                this.$store.commit('ADD_CURRENT_BOARD_ID', obj.id);
            },
            handleDelete(obj) {
                this.$confirm('Delete [' + obj.title + '] perminantly?', 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/web/board/" + obj.id).then(resp => {
                        this.initTableData('');
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Deletion Canceled.'
                    });
                });
            },
            publishedSwitch(obj) {
                this.getRequest('/web/changeBoard/published?id=' + obj.id + '&published=' + obj.published).then(resp => {
                });
            },
        }
    }
</script>

<style>

</style>