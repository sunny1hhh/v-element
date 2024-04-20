<template>
  <div
    class="vk-collapse"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
    import {ref, provide, watch} from 'vue'
    import type { NameType, CollapseProps, CollapseEmits } from './types';
    import {CollapseContextKey} from './types'

    defineOptions({
        name: 'VkCollapse'
    })

    const props = defineProps<CollapseProps>()
    const emits = defineEmits<CollapseEmits>()



    // 定义一个数组存放现在打开的item
    const activeNames = ref<NameType[]>(props.modelValue)

    // 当props属性用于ref声明，可能会导致不能更新，要用watch监视
    watch(() => props.modelValue, () => {
        activeNames.value = props.modelValue
    })

    if(props.accordion && activeNames.value.length > 1){
        console.warn('accordion mode should only have one active item')
    }

    // 对数组进行更新
    const handleItemClick = (item:NameType) => {
        if(props.accordion){
            activeNames.value = [activeNames.value[0] === item ? '' : item]
        }else{
            const index = activeNames.value.indexOf(item)
            if(index > -1){
                // 存在，删除数组对应的一项
                activeNames.value.splice(index, 1)
            }else{
                // 不存在，插入对应的name
                activeNames.value.push(item)
            }
            emits('update:modelValue', activeNames.value)
            emits('change', activeNames.value)
        }

    }

    provide(CollapseContextKey, {
        activeNames,
        handleItemClick
    })
</script>

<style>

</style>