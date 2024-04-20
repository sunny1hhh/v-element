<template>
    <div
        class="vk-collapse-item"
        :class="{
            'is-disabled': disabled
        }"
    >
        <!-- 标题部分 -->
        <div
            class="vk-collapse-item__header"
            :class="{
                'is-disabled': disabled,
                'is-active': isActive
            }"
            :id="`item-header-${name}`"
            @click="handleClick"
        >
            <slot name="title">{{ title }}</slot>
            <Icon icon="angle-right" class="header-angle" />
        </div>
        <!-- 内容部分 -->
        <Transition name="slide" v-on="transitionEvents">
            <div class="vk-collapse-item__wrapper" v-show="isActive">
                <div class="vk-collapse-item__content" :id="`item-content-${name}`">
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import type { CollapseItemProps } from './types';
    import { inject, computed } from 'vue';
    import {CollapseContextKey} from './types'
    import Icon from '../Icon/Icon.vue';

    defineOptions({
        name: 'VkCollapseItem'
    })
    const props = defineProps<CollapseItemProps>()

    // provide和inject用于祖给孙传递信息，比props方便
    const CollapseContext = inject(CollapseContextKey)
    // 判断一下item是否被打开
    const isActive = computed(() => CollapseContext?.activeNames.value.includes(props.name))

    const handleClick = () => {
        if(props.disabled) {return}
        CollapseContext?.handleItemClick(props.name)
    }

    const transitionEvents: Record<string, (el: HTMLElement) => void> = {
        beforeEnter(el) {
            el.style.height = '0px'
            el.style.overflow = 'hidden'
        },
        enter(el) {
            el.style.height = `${el.scrollHeight}px`
        },
        afterEnter(el) {
            el.style.height = ''
            el.style.overflow = ''
        },
        beforeLeave(el) {
            el.style.height = `${el.scrollHeight}px`
            el.style.overflow = 'hidden'
        },
        leave(el) {
            el.style.height = '0px'
        },
        afterLeave(el) {
            el.style.height = ''
            el.style.overflow = ''
        }
    }
</script>

<style>

</style>