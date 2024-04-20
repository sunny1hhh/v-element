<template>
    <div
        class="vk-tooltip"
        v-on="outerEvent"
        ref="popperContainerNode"
    >
        <div
            class="vk-tooltip__trigger"
            ref="triggerNode"
            v-on="events"
        >
            <slot></slot>
        </div>
        <Transition :name="transition">
            <div
                class="vk-tooltip__popper"
                ref="popperNode"
                v-if="isOpen"
            >
                <slot name="content">
                    {{content}}
                </slot>
                <div id="arrow" data-popper-arrow></div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, watch, onUnmounted, computed } from 'vue';
    import type { TooltipProps, TooltipEmits, TooltipInstance } from './types';
    import { createPopper } from '@popperjs/core'
    import type { Instance } from '@popperjs/core'
    import { debounce } from 'lodash-es'
    import useClickOutside from '../../hooks/useClickOutside'

    const props = withDefaults(defineProps<TooltipProps>(), {
        placement: 'bottom',
        trigger: 'hover',
        transition: 'fade',
        openDelay: 0,
        closeDelay: 0,
    })

    const emits = defineEmits<TooltipEmits>()
    const isOpen = ref(false)
    const popperNode = ref<HTMLElement>()
    const triggerNode = ref<HTMLElement>()
    const popperContainerNode = ref<HTMLElement>()
    const togglePopper = () => {
        isOpen.value = !isOpen.value
        emits('visible-change', isOpen.value)
    }

    let popperInstance: null | Instance = null
    let events: Record<string, any> = reactive({})
    let outerEvent: Record<string, any> = reactive({})

    const open = () => {
        isOpen.value = true
        emits('visible-change', true)
    }

    const close = () => {
        isOpen.value = false
        emits('visible-change', false)
    }

    const openDebounce = debounce(open, props.openDelay)
    const closeDebounce = debounce(close, props.closeDelay)

    const openFinal = () => {
        closeDebounce.cancel()
        openDebounce()
    }
    const closeFinal = () => {
        openDebounce.cancel()
        closeDebounce()
    }

    useClickOutside(popperContainerNode, () => {
        if(props.trigger === 'click' && isOpen.value && !props.manual){
            closeFinal()
        }
        if(isOpen.value){
            emits('click-outside', true)
        }
    })

    const attachEvents = () => {
        if(props.trigger === 'hover'){
            events['mouseenter'] = openFinal
            outerEvent['mouseleave'] = closeFinal
        }else if(props.trigger === 'click'){
            events['click'] = togglePopper
        }
    }
    if(!props.manual){
        attachEvents()
    }

    const popperOptions = computed(() => {
        return {
            placement: props.placement,
            modifiers: [
            {
                name: 'offset',
                options: {
                offset: [0, 9],
                },
            }
            ],
            ...props.popperOptions
        }
    })

    watch(() => props.manual, (isManual) => {
        if(isManual){
            events = {}
            outerEvent = {}
        }else{
            attachEvents()
        }
    })

    watch(() => props.trigger, (newTrigger, oldTrigger) => {
        if(newTrigger !== oldTrigger){
            events = {}
            outerEvent = {}
            attachEvents()
        }
    })

    watch(isOpen, (newValue) => {
        if (newValue) {
            if (triggerNode.value && popperNode.value) {
            popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
            } else {
            popperInstance?.destroy()
            }
        }
    }, { flush: 'post'})

    onUnmounted(() => {
        popperInstance?.destroy()
    })

    defineExpose<TooltipInstance>({
        'show': openFinal,
        'hide': closeFinal
    })
</script>