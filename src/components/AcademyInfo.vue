<template>
    <div style="margin-top: 50px;">

        <el-row style="margin-left: 10%; margin-top: 20px" type="flex">
            <el-col :span="24">
                <el-table
                        :data="academies"
                        border
                        style="width: fit-content">
                    <el-table-column
                            type="index"
                            fixed
                            width="60">
                    </el-table-column>
                    <el-table-column
                            fixed
                            prop="id"
                            label="ID"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            fixed
                            prop="name"
                            label="Academy Name"
                            width="180">
                    </el-table-column>
                   
                </el-table>
            </el-col>
        </el-row>

        <el-pagination
                style="margin-top: 20px"
                class="align-center"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="courseTotal">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "AcademyManage",
        data() {
            return {
                academies: [],
            }
        },
        mounted() {
            this.searchAcademyData();
        },
        methods: {
            searchAcademyData() {
               this.getRequest('/web/academy/initAll').then(resp => {
                    this.academies = resp.data;
                });
            },
        }
    }
            
</script>

<style scoped>
    .align-center {
        text-align: center;
    }
</style>