<template>
    <div style="margin-top: 10px">
        <el-form class="board-form" ref="boardForm" :model="boardForm" label-width="100px">
            <el-form-item label="Type">
                <el-select class="form-item" v-model.number="boardForm.typeName" clearable  placeholder="Please choose">
                    <el-option
                            v-for="item in allTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Title">
                <el-input class="form-item" v-model="boardForm.title" placeholder="Please enter title.." clearable></el-input>
            </el-form-item>
            <el-form-item label="Status">
                <el-switch
                        v-model="boardForm.published"
                        active-text="Show"
                        inactive-text="Hidden">
                </el-switch>
            </el-form-item>
        </el-form>
        <div ref="editorElem" class="editor"></div>
        <div style="text-align: center; margin-top: 20px">
            <el-button type="primary" @click="submitBoard" v-text="buttonName"></el-button>
            <el-button @click="resetForm">Reset</el-button>
        </div>
        <div v-html="htmlCode"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: "AddBoardContent",
        data() {
            return {
                boardForm: {
                    id: '',
                    typeName: '',
                    title: '',
                    published: true,
                    content: '',
                },
                editor: null,
                htmlCode: '',
                allTypes: [{
                    value: 'AR Notification',
                    name: 'AR Notification'
                }, {
                    value: 'System Notification',
                    name: 'System Notification'
                }],
                updateInfo: false,
                buttonName: '',
            }
        },
        watch: {

        },
        mounted () {
            let boardId = this.$store.state.currentBoardId;
            if (boardId !== -1) {
                this.updateInfo = true;
                this.buttonName = 'Update';
                this.getRequest('/web/getBoard?id=' + boardId).then(resp => {
                    this.boardForm.typeName = resp.data.typeName;
                    this.boardForm.id = resp.data.id;
                    this.boardForm.title = resp.data.title;
                    this.boardForm.content = resp.data.content;
                    this.boardForm.published = resp.data.published;
                    this.initEditor(this.boardForm.content);
                });
            } else {
                this.initEditor('');
                this.buttonName = 'Create';
            }

        },
        methods: {
            resetForm() {
                this.boardForm = {};
                this.editor.txt.clear();
            },
            initEditor(content) {
                this.editor = new E(this.$refs.editorElem);
                this.editor.customConfig.zIndex = 100;
                this.editor.customConfig.onchange = (html) => {
                    this.boardForm.content = html;
                };
                this.editor.customConfig.menus = [          // menu configs
                    'head',  // title
                    'bold',
                    'fontSize',
                    'fontName',
                    'italic',
                    'underline',
                    'strikeThrough',
                    'foreColor',
                    'backColor',
                    'link',
                    'list',
                    'justify',
                    'quote',
                    'emoticon',
                    'table',
                    'code',
                    'undo',
                    'redo'
                ];
                this.editor.create();     // create instance
                if (this.boardForm.content) {
                    this.editor.txt.html(content);
                }
            },
            submitBoard() {
                if (this.updateInfo) {
                    this.postJsonRequest('/web/update/board', this.boardForm).then(resp => {
                        if (resp.data.status === 406) {
                            this.showErrorMessage(resp.data.object);
                        }
                    });
                } else {
                    this.postJsonRequest('/web/add/board', this.boardForm).then(resp => {
                        if (resp.data.status === 406) {
                            this.showErrorMessage(resp.data.object);
                        }
                    });
                }
            },
            showErrorMessage(message) {
                this.$message.error(message);
            }
        }
    }
</script>

<style>
    .w-e-text-container {
        background-color: white;
        height: 450px !important;
    }

    .editor {
        margin-top: 40px;
        /*position: relative;
        margin-top: 200px;*/
    }

    .form-item {
        width: 400px;
    }

    .board-form {
        margin-top: 20px;
    }

</style>