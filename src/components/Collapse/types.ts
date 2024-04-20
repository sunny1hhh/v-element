import type { InjectionKey, Ref } from "vue";
export type NameType = string | number


export interface CollapseProps{
    // api中写的传递modelValue
    modelValue: NameType[];
    // 这个表示是否是手风琴模式
    accordion?: boolean;
}

export interface CollapseItemProps {
    name: NameType;
    title?: string;
    disabled?: boolean;
}

export interface CollapseContext{
    activeNames: Ref<NameType[]>;
    handleItemClick: (name: NameType) => void;
}

// 定义事件
export interface CollapseEmits{
    (e: 'update:modelValue', values: NameType[]) : void;
    (e: 'change', values: NameType[]) : void;
}

export const CollapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContext')