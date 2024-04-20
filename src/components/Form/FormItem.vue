<template>
    <div
        class="vk-form-item"
        :class="{
            'is-error': validateStatus.state === 'error',
            'is-success': validateStatus.state === 'success',
            'is-loading': validateStatus.loading,
            'is-required': isRequired
        }"
    >
        <label class="vk-form-item__label">
            <slot name="label" :label="label">
                {{ label }}
            </slot>
        </label>
        <div class="vk-form-item__content">
            <slot :validate="validate"></slot>
            <div class="vk-form-item__error-msg" v-if="validateStatus.state === 'error'">
                {{ validateStatus.errorMsg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { FormItemProps, FormValidateFailure, FormItemContext, ValidateStatusProp, FormItemInstance } from './types';
    import { computed, inject, reactive, provide, onMounted, onUnmounted } from 'vue';
    import { formContextKey, formItemContextKey } from './types';
    import { isNil } from 'lodash-es';
    import Schema from 'async-validator';

    defineOptions({
        name: 'VkFormItem'
    })
    const props = defineProps<FormItemProps>()

    const formContext = inject(formContextKey)

    // 添加验证的状态
    const validateStatus: ValidateStatusProp = reactive({
        state: 'init',
        errorMsg: '',
        loading: false
    })

    // 取出需要校验的内容
    const innerValue = computed(() => {
        const model = formContext?.model
        if(model && props.prop && !isNil(model[props.prop])){
            return model[props.prop]
        }else {
            return ''
        }
    })

    // 取出对应的校验规则：
    const itemRules = computed(() => {
        const rules = formContext?.rules
        if(rules && props.prop && rules[props.prop]){
            return rules[props.prop]
        }else {
            return []
        }
    })

    // 是否是必填，用于添加必填的样式
    const isRequired = computed(() => {
        return itemRules.value?.some(rule => rule.required)
    })

    // 确定验证的规则（根据trigger（使用验证规则的时机（事件））确定，这样子就不会一股脑儿地全部验证）
    const getTriggeredRules = (trigger?: string) => {
        const rules = itemRules.value
        if(rules){
            return rules.filter(rule => {
                if(!rule.trigger || !trigger) return true
                return rule.trigger && rule.trigger === trigger
            })
        }else {
            return []
        }
    }

    // 验证
    const validate = async (trigger?: string) => {
        const modelName = props.prop
        const triggerRules = getTriggeredRules(trigger)
        if(triggerRules.length === 0){
            return true
        }
        if(modelName){
            const validator = new Schema({
                [modelName]: triggerRules
            })
            validateStatus.loading = true
            return validator.validate({ [modelName]: innerValue.value})
                .then(() => {
                    validateStatus.state = 'success'
                })
                .catch((e: FormValidateFailure) => {
                    const { errors } = e
                    validateStatus.state = 'error'
                    validateStatus.errorMsg = (errors && errors.length > 0) ? errors[0].message || '' : ''
                    console.log(e.errors);
                    console.log('inner:', innerValue.value);

                    return Promise.reject(e)
                })
                .finally(() => {
                    validateStatus.loading = false
                })
        }
    }

    let initialValue: any = undefined
    // 恢复重置状态的功能
    const clearValidate = () => {
        validateStatus.state = 'init'
        validateStatus.errorMsg = ''
        validateStatus.loading = false
    }
    const resetField = () => {
        const model = formContext?.model
        clearValidate()
        if (model && props.prop && model[props.prop]) {
            model[props.prop] = initialValue
        }
    }

    const context: FormItemContext = {
        validate,
        prop: props.prop || '',
        clearValidate,
        resetField
    }
    provide(formItemContextKey, context)

    // 挂载的时候添加
    onMounted(() => {
        if (props.prop) {
            formContext?.addField(context)
            initialValue = innerValue.value
        }
    })
    onUnmounted(() => {
        formContext?.removeField(context)
    })

    defineExpose<FormItemInstance>({
        validateStatus,
        validate,
        clearValidate,
        resetField,
    })
</script>