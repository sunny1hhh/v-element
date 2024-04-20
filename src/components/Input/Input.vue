<template>
    <div
        class="vk-input"
        :class="{
            [`vk-input--${type}`]: type,
            [`vk-input--${size}`]: size,
            'is-disabled': disabled,
            'is-prepend': $slots.prepend,
            'is-append': $slots.append,
            'is-prefix': $slots.prefix,
            'is-suffix': $slots.suffix,
            'is-focus': isFocus
        }"
    >
        <!-- Input -->
        <template v-if="type !== 'textarea'">
            <!-- prepend slot -->
            <div v-show="$slots.prepend" class="vk-input__prepend">
                <slot name="prepend"></slot>
            </div>
            <div class="vk-input__wrapper">
                <!-- prefix slot -->
                <span v-show="$slots.prefix" class="vk-input__prefix">
                    <slot name="prefix"></slot>
                </span>
                <!-- input框 -->
                <input
                    class="vk-input__inner"
                    ref="inputRef"
                    :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
                    :disabled="disabled"
                    :readonly="readonly"
                    :autocomplete="autocomplete"
                    :placeholder="placeholder"
                    :autofocus="autofocus"
                    :form="form"
                    v-model="innerValue"
                    v-bind="attrs"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @change="handleChange"
                >
                <!-- suffix slot -->
                <span v-show="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix" @click="keepFocus">
                    <slot name="suffix"></slot>
                    <Icon
                        icon="circle-xmark"
                        v-if="showClear"
                        class="vk-input__clear"
                        @click="clear"
                        @mousedown.prevent="NOOP"
                    />
                    <Icon
                        icon="eye"
                        v-if="showPasswordArea && passwordVisible"
                        class="vk-input__password"
                        @click="togglePasswordVisible"
                    />
                    <Icon
                        icon="eye-slash"
                        v-if="showPasswordArea && !passwordVisible"
                        class="vk-input__password"
                        @click="togglePasswordVisible"
                    />
                </span>
                <!-- append slot -->
                <span v-show="$slots.append" class="vk-input__append">
                    <slot name="append"></slot>
                </span>
            </div>
        </template>

        <!-- textarea -->
        <template v-else>
            <textarea
                class="vk-textarea__wrapper"
                ref="inputRef"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :autofocus="autofocus"
                :form="form"
                v-model="innerValue"
                v-bind="attrs"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            ></textarea>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, computed, useAttrs, nextTick, inject } from 'vue';
    import type { InputProps, InputEmits } from './types';
    import type{ Ref } from 'vue';
    import Icon from '../Icon/Icon.vue';
    import { formItemContextKey } from '../Form/types';

    defineOptions({
        name: 'VkInput',
        inheritAttrs: false
    })

    const props = withDefaults(defineProps<InputProps>(), {
        type: 'test'
    })

    // 接收验证的函数
    const formItemContext = inject(formItemContextKey)
    const passwordVisible = ref(false)
    const innerValue = ref(props.modelValue)
    // 将其他属性添加到组件上
    const attrs = useAttrs()
    const inputRef = ref() as Ref<HTMLInputElement>
    watch(() => props.modelValue, (newValue) => {
        innerValue.value = newValue
    })

    const emits = defineEmits<InputEmits>()

    // 包装一下验证函数。要写成回调函数的方式才能通过类型检查
    const runValidation = (trigger?: string) => {
        return formItemContext?.validate(trigger).catch((e) => console.log(e))
    }
    const isFocus = ref(false)
    //获取焦点
    const keepFocus = async () => {
        await nextTick()
        inputRef.value.focus()
    }
    // 是否展示清除按键
    const showClear = computed(() =>
        props.clearable &&
        !props.disabled &&
        !!innerValue.value &&
        isFocus.value
    )

    const NOOP = () => {}
    // 是否展示密码
    const showPasswordArea = computed(() =>
        props.showPassword &&
        !props.disabled &&
        !!innerValue.value
    )

    // 切换密码图标
    const togglePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value
    }

    // 处理input事件
    const handleInput = () => {
        emits('update:modelValue', innerValue.value)
        emits('input', innerValue.value)
        runValidation('input')
    }
    // 处理change事件
    const handleChange = () => {
        emits('change', innerValue.value)
        runValidation('change')
    }
    // 处理focus事件
    const handleFocus = (event: FocusEvent) => {
        isFocus.value = true
        emits('focus', event)
    }
    // 处理blur事件
    const handleBlur = (event: FocusEvent) => {
        isFocus.value = false
        runValidation('blur')
        emits('blur', event)
    }
    // 处理clear事件
    const clear = () => {
        innerValue.value = ''
        emits('update:modelValue', '')
        emits('clear')
        emits('input', '')
        emits('change', '')
    }

    // 将DOM元素暴露出去
    defineExpose({
        ref: inputRef
    })
</script>