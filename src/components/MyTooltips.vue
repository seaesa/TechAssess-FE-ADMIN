<template>
    <a href="#" class="my-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" :title="description">
        <i class="fa-regular fa-circle-question"></i>
    </a>
</template>

<script>
export default {
    name: 'MyTooltips',
    props: ['description'],
    setup(props) {
        console.log(props.description);
    }
}
</script>
