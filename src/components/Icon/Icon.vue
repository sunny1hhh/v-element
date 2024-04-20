<template>
  <i class="vk-icon" :class="{[`vk-icon--${type}`] : type }" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps"/>
  </i>
</template>

<script setup lang="ts">
    import type {IconProps} from './types'
    import {computed} from 'vue'
    import { omit } from 'lodash-es'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    defineOptions({
        name: 'VkIcon',
        // 阻止组件间透传，如果透传就会传到根组件上面，即传到i标签上，阻止透传后可以使用$props取到所有的props
        inheritAttrs: false
    })
    const props = defineProps<IconProps>()
    const filteredProps = computed(() => omit(props, ['type', 'color']))
    const customStyles = computed(() => {
        return props.color ? { color: props.color } : {}
    })
</script>

<style>

</style>