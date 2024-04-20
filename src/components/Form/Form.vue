<template>
    <form class="vk-form">
        <slot></slot>
    </form>
</template>

<script setup lang="ts">
    import { provide } from 'vue';
    import type { ValidateFieldsError } from 'async-validator'
    import type { FormProps, FormItemContext, FormContext, FormValidateFailure, FormInstance } from './types';
    import { formContextKey } from './types';

    defineOptions({
        name: 'VkForm'
    })
    const props = defineProps<FormProps>()

    // 将每个item的验证结果都存储到下面这个数组里面，通过provide传递
    const fields: FormItemContext[] = []
    const addField: FormContext['addField'] = (field) => {
        fields.push(field)
    }
    const removeField: FormContext['removeField'] = (field) => {
        if (field.prop) {
            fields.splice(fields.indexOf(field), 1)
        }
    }
    // 把需要的model和rules都传递给item
    provide(formContextKey, {
        ...props,
        addField,
        removeField
    })

    // 清除和重置功能
    const resetFields = (keys: string[] = []) => {
        const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields
        filterArr.forEach(field => field.resetField())
    }
    const clearValidate = (keys: string[] = []) => {
        const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields
        filterArr.forEach(field => field.clearValidate())
    }

    // 验证所有的的Item
    const validate = async () => {
        //const promiseArr = fields.map(field => field.validate(''))
        let validationErrors: ValidateFieldsError = {}
        for (const field of fields) {
            try {
            await field.validate('')
            } catch(e) {
            const error = e as FormValidateFailure
            validationErrors = {
                ...validationErrors,
                ...error.fields
            }
            }
        }
        if (Object.keys(validationErrors).length === 0) return true
        return Promise.reject(validationErrors)
    }

    defineExpose<FormInstance>({
        validate,
        clearValidate,
        resetFields
    })
</script>