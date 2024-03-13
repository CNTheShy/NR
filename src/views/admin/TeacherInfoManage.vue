<template>
    <component v-bind:is="currentName" @changeName="changeName"></component>
</template>

<script>
    import updateInfo from '../../components/UpdateTeacherInfo'
    import teacherInfo from '../../components/TeacherInfoComponent'

    export default {
        name: "TeacherInfoManage",
        data() {
            return {
                currentName: 'teacherInfo',
                updateStudentInfo: '',
            }
        },
        components: {
            updateInfo,
            teacherInfo,
        },
        methods: {
            changeName(name) {
                this.currentName = name;
            }
        },
    }
</script>

<style scoped>

</style>