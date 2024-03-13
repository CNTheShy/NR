<template>
    <div>
        <el-row :gutter="20" type="flex">
            <!-- Mini information -->
            <el-col :span="12">
                <el-row>
                    <el-card shadow="hover" style="height: 230px; width: 600px;">
                        <div class="user-info">
                            <div @click="avatarClick">
                                <img class="user-avatar" :src=this.avatarUrl alt="avater"/>
                            </div>
                            <div class="user-info-cont">
                                <div v-text="userInfo.name" style="color: #222;font-size: 25px;"></div>
                                <div v-text="role"></div>
                            </div>
                        </div>
                        <div style="display: flex; font-size: 15px; color: #999;">
                            Current Location:
                            <div class="user-info-list">
                                <span v-text="position.province"></span>
                                <el-divider direction="vertical"></el-divider>
                                <span v-text="position.city"></span>
                            </div>
                        </div>
                    </el-card>
                </el-row>
            </el-col>

            <el-col :span="12">
                <el-tabs tab-position="left" v-model="activeTab" @tab-click="tabClick" type="border-card" style="height: 400px; overflow-x: auto;">
                    <el-tab-pane name="AR Notification">
                        <span slot="label">
                            <i class="el-icon-s-claim"></i>
                            <span>AR Notifications</span>
                        </span>
                        <el-row :gutter="0" class="icon-more">
                            <span @click="changePage1(false)"><i class="el-icon-caret-left"></i></span>
                            <span @click="changePage1(true)"><i class="el-icon-caret-right"></i></span>
                        </el-row>
                        <br>
                        <div v-for="content in noticeContent_1" style="height: 30px;">
                            <div>
                                <div class="content-title" v-text="content.title" @click="contentClick(content.id)"></div>
                                <div class="content-date" v-text="content.createTime"></div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="System Notification"><span slot="label"><i class="el-icon-s-opportunity"></i>
                        <span>System Notifications</span>
                    </span>
                        <el-row :gutter="0" class="icon-more">
                            <span @click="changePage2(false)"><i class="el-icon-caret-left"></i></span>
                            <span @click="changePage2(true)"><i class="el-icon-caret-right"></i></span>
                        </el-row>
                        <br>
                        <div v-for="content in noticeContent_2" style="height: 30px">
                            <div>
                                <div class="content-title" v-text="content.title" @click="contentClick(content.id)"></div>
                                <div class="content-date" v-text="content.createTime"></div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>

        <div style="margin-top: 30px"></div>

        <!-- Echart报表 -->
        <keep-alive>
            <el-row :gutter="20" type="flex">
                <el-col :span="12">
                    <el-card class="chart-card" shadow="hover">
                        <!-- access streaming chart -->
                        <div id="visitedNum" style="width: 800px;height:400px;"></div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="chart-card" shadow="hover">
                        <!-- academy student count chart -->
                        <div id="academyNum" style="width: 800px;height:400px;"></div>
                    </el-card>
                </el-col>
            </el-row>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                activeTab: 'AR Notification',
                userInfo: '',
                role: '',
                avatarUrl: '',
                city: '',
                position: {
                    city: '',
                    province: '',
                },
                orgOptions: {},
                noticeContent_1: [],
                noticeContent_2: [],
                currPage1: 1,
                currPage2: 1,
                hasNextPage1: false,
                hasPrePage1: false,
                hasNextPage2: false,
                hasPrePage2: false,
            }
        },
        mounted() {
            //initialize
            this.drawVisitedNum();
            this.drawAcademyNum();
            //document.querySelector('body').setAttribute('style', 'background: #f0f0f0');
            this.initBoardContent();
            this.userInfo = JSON.parse(localStorage.getItem('user'));
            if (this.userInfo.status === 1) {
                this.role = 'Administrator';
            } else if (this.userInfo.status === 2) {
                this.role = 'Student';
            } else if (this.userInfo.status === 3) {
                this.role = 'Instructor';
            }
            //in case no avatar
            if (this.userInfo.avatar === '') {
                this.avatarUrl = require('../../assets/user_pic_middle.gif');
            } else {
                this.avatarUrl = this.userInfo.avatar;
            }

            const _this = this;
            
           /* AMap.plugin('AMap.CitySearch', function () {
                var citySearch = new AMap.CitySearch();
                citySearch.getLocalCity(function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // success, show the city location
                        _this.position.city = result.city;
                        _this.position.province = result.province;
                    }
                })
            }),*/
            
           	AMap.plugin('AMap.CitySearch', function () {
  							var citySearch = new AMap.CitySearch()
  									citySearch.getLocalCity(function (status, result) {
    										if (status === 'complete' && result.info === 'OK') {
      											// success, show the city location
      											_this.position.city = result.city;
                        		                _this.position.province = result.province;
    										}
  									})
								})
       	},
        methods: {
            initBoardContent() {
                let currPage = 0;
                if (this.activeTab === 'AR Notification') {
                    currPage = this.currPage1;
                } else {
                    currPage = this.currPage2;
                }
                this.getRequest('/web/board/type?currPage=' + currPage + '&pageSize=' + 10 + '&typeName=' + this.activeTab).then(resp => {
                    if (this.activeTab === 'AR Notification') {
                        this.noticeContent_1 = resp.data.list;
                        this.hasNextPage1 = resp.data.hasNextPage;
                        this.hasPrePage1 = resp.data.hasPreviousPage;
                    } else {
                        this.noticeContent_2 = resp.data.list;
                        this.hasNextPage2 = resp.data.hasNextPage;
                        this.hasPrePage2 = resp.data.hasPreviousPage;
                    }
                });
            },
            avatarClick() {
                this.$router.replace('/center');
            },
            drawVisitedNum() {
                // initialize echart based on dom
                let myChart = this.$echarts.init(document.getElementById("visitedNum"));
                // configs
                let option = {
                    title: {
                        text: "Access in 7 Days"
                    },
                    tooltip: {},
                    legend: {
                        data: ["Accesses"]
                    },
                    xAxis: {
                        type: 'category',
                        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: "Accesses",
                            type: "line",
                            data: [5, 20, 36, 10, 10, 20, 56]
                        }
                    ]
                };
                // show chart
                myChart.setOption(option);
            },
            drawAcademyNum() {
                let myChart = this.$echarts.init(document.getElementById("academyNum"));
                var data = [{
                    name: 'FST',
                    value: 10
                }, {
                    name: 'FBM',
                    value: 20
                }, {
                    name: 'SCC',
                    value: 10
                }, {
                    name: 'FHS',
                    value: 10
                }, {
                    name: 'SGE',
                    value: 5
                }, {
                    name: 'GS',
                    value: 8
                }];
                let option = {
                    title: {
                        text: 'Student number information',
                        textStyle: {
                            fontFamily: 'monospace',
                        },
                        left: '43%',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                    },
                    series: [
                        {
                            name: 'academy student number',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            animation: false,
                            label: {
                                position: 'outer',
                                alignTo: 'labelLine',
                                bleedMargin: 5
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: data,
                        }
                    ]
                };
                myChart.setOption(option);
            },
            contentClick(val) {
                this.$store.state.boardId = val;
                this.$router.replace('/boardDetails');
            },
            tabClick(tab) {
                this.activeTab = tab.name;
                this.initBoardContent();
            },
            changePage1(val) {
                if (val && this.hasNextPage1) {
                    this.currPage1 = this.currPage1 + 1;
                    this.initBoardContent();
                }
                if (!val && this.hasPrePage1) {
                    this.currPage1 = this.currPage1 - 1;
                    this.initBoardContent();
                }
            },
            changePage2(val) {
                if (val && this.hasNextPage1) {
                    this.currPage2 = this.currPage2 + 1;
                    this.initBoardContent();
                }
                if (!val && this.hasPrePage1) {
                    this.currPage2 = this.currPage2 - 1;
                    this.initBoardContent();
                }
            }
        }
    }
</script>

<style>
    .el-tabs__item {
        font-size: 16px !important;
        font-family: 'monospace';
        font-weight: normal;
        text-align: left !important;
    }

    .el-tabs__nav-scroll {
        background-color: #f5f7fa;
    }

    .content-title {
        color: #777676;
        font-size: 16px;
        font-family: 'sans-serif';
        margin-left: 3px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
    }

    .content-title:hover {
        color: #1890ff;
        cursor: pointer;
    }

    .content-date {
        color: #777676;
        font-size: 14px;
        float: right;
    }

    .icon-more {
        margin-top: -10px;
        float: right;
        color: #1890ff;
        cursor: pointer;
        font-size: 20px;
    }

    .chart-card {
        overflow: auto;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 2px solid #ccc;
    }

    .user-info-cont {
        padding-left: 60px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-list {
        margin-left: 50px;
    }

</style>