<template>
    <component v-bind:is="currName" @changeName="changName"></component>
</template>

<script>
    import AcademyInfo from "../../components/AcademyInfo";
    
    export default {
        name: "AcademyManage",
        data() {
            return {
                currName: 'AcademyInfo'
            }
        },
        components: {
            AcademyInfo,
        },
        methods: {
            changName(name) {
                this.currName = name;
            }
        },
    }
</script>

<style scoped>

</style>