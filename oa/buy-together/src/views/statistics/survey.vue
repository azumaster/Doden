<template>
    <div id="survey" class="survey">
        <pageHead title="集采统计"></pageHead>

        <template>
            <div class="page-filter">
                <div class="filter-group">
                    <Date-picker type="datetimerange" placement="bottom-start" placeholder="选择日期的范围"
                                 style="width: 300px" @on-change="dateChange" @on-clear="clearSelect"></Date-picker>
                    <Button type="primary" @click="select">确认筛选</Button>
                </div>

            </div>
        </template>
        <template>
            <statistics ref="statistics"></statistics>
            <div class="divide"></div>
        </template>
    </div>
</template>

<script>
    import pageHead from './../../components/pageHead.vue';
    import statistics from './statistics.vue';

    export default {
        components: {
            pageHead,
            statistics
        },
        data(){
            return {
                start: '0',
                end: '0'
            };
        },
        methods: {
            dateChange (e){
                var time = e.split(' - ');
                this.start = time[0];
                this.end = time[1];
            },
            select(){
                if(this.start == 0 || this.end == 0){
                    this.$Message.warning('请先选择日期范围');
                    return;
                }

                this.$refs.statistics.params.time = [this.start, this.end];
                this.$refs.statistics.getBaseData();
            },
            clearSelect(){
                this.$refs.statistics.params.time = null;
                this.$refs.statistics.getBaseData();
            }
        }
    };
</script>