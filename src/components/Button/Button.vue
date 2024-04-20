<template>
    <button
        ref="_ref"
        class="vk-button"
        :class="{
            [`vk-button--${type}`]: type,
            [`vk-button--${size}`]: size,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle,
            'is-disabled': disabled,
        }"
        :disabled="disabled || loading"
        :autofocus="autofocus"
        :type="nativeType"
    >
        <Icon icon="spinner" spin v-if="loading" />
        <Icon :icon="icon" v-if="icon" />
        <span>
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
    import type { ButtonProps } from './types';
    import Icon from '../Icon/Icon.vue';
    import {ref} from 'vue'

    // 添加默认值button
    withDefaults(defineProps<ButtonProps>(), {
        nativeType: 'button'
    })

    // 使用插件定义组件名
    defineOptions({
        name:'VkButton'
    })

    const _ref = ref<HTMLButtonElement>()
    defineExpose({
        ref: _ref
    })
</script>

<style>

</style>