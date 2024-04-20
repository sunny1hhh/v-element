import type { VNode } from 'vue'
export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export type RenderLabelFunc = (option: SelectOption) => VNode
// 自定义筛选值的函数
export type CustomFilterFunc = (value: string | number) => SelectOption[]
// 自定义remote处理方式
export type CustomFilterRemoteFunc = (value: string | number) => Promise<SelectOption[]>

export interface SelectProps {
    // v-model
    modelValue: string | number;
    // 选项
    options?: SelectOption[];
    // 一些基本表单属性
    placeholder?: string;
    disabled?: boolean;
    // 清除按钮
    clearable?: boolean;
    // 回调函数返回要渲染的VNode
    renderLabel?: RenderLabelFunc;
    // 是否可筛选属性
    filterable?: boolean;
    // 自定义筛选函数
    filterMethod?: CustomFilterFunc;
    // 支持远程搜索
    remote?: boolean;
    remoteMethod?: CustomFilterRemoteFunc;
}

export interface SelectStates {
    // input框中的内容
    inputValue: string;
    // 选中的option
    selectedOption: null | SelectOption;
    // 鼠标悬浮
    mouseHover: boolean;
    // 是否在加载
    loading: boolean;
    // 键盘事件上下键选择的option
    highlightIndex: number;
}

export interface SelectEmits{
    (e: 'change', value: string | number) : void;
    (e: 'update:modelValue', value: string | number) : void;
    (e: 'visible-change', value:boolean): void;
    (e: 'clear'): void;
}