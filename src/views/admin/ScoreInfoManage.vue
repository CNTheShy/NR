<template>
    <component v-bind:is="currentName" @changeName="changeName"></component>
</template>

<script>
    import updateScoreInfo from '../../components/UpdateScoreInfo'
    import scoreInfo from '../../components/ScoreInfoComponent'

    export default {
        name: "ScoreInfoManage",
        data() {
            return {
                currentName: 'scoreInfo',
                updateScoreInfo: '',
            }
        },
        components: {
            updateScoreInfo,
            scoreInfo,
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