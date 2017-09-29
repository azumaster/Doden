<template>
    <div class="layout-breadcrumb">
        <Breadcrumb>
            <Breadcrumb-item href="/">首页</Breadcrumb-item>
        </Breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'breadcrumb',
        data: ()=>{
            return {
                currentBreadcrumb:{}
            };
        },
        updated: ()=>{
//            let name = window.location.hash.split('/')[1];
        }
    };
</script>