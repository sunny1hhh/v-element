import type { InjectionKey } from "vue";
import type { RuleItem,  ValidateError, ValidateFieldsError, } from 'async-validator'

export interface FormItemProps{
    label?: string;
    // 来确定item的类型，是email还是password，用于实现验证的功能，设置为可选值
    prop?: string;
}

// 状态的类型
export interface ValidateStatusProp {
    state: 'init' | 'success' | 'error';
    errorMsg: string;
    loading: boolean;
}

export interface FormItemRule extends RuleItem {
    // 使用验证规则的时机（事件）
    trigger?: string;
}

// 定义rule的类型
export type FormRules = Record<string, FormItemRule[]>

export interface FormProps {
    model: Record<string, any>;
    rules?: FormRules;
}

// 定义错误e的类型，方便我们操作
export interface FormValidateFailure {
    errors: ValidateError[] | null
    fields: ValidateFieldsError
}

export interface FormContext extends FormProps {
    addField: (field: FormItemContext) => void;
    removeField: (field: FormItemContext) => void;
}

export interface FormItemContext {
    prop: string;
    validate: (trigger?: string) => Promise<any>;
    resetField(): void;
    clearValidate(): void;
}

// FORM组件暴露出去的内容
export interface FormInstance {
    validate: () => Promise<any>;
    resetFields: (props?: string[]) => void;
    clearValidate: (props?: string[]) => void;
}

// FormItem组件暴露的内容
export interface FormItemInstance {
    validateStatus: ValidateStatusProp;
    validate: (trigger?: string) => Promise<any>;
    resetField(): void;
    clearValidate(): void;
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')