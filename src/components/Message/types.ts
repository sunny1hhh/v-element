import type { VNode, ComponentInternalInstance } from 'vue'
export interface MessageProps {
    message?: string | VNode;
    duration?: number;
    showClose?: boolean;
    type?: 'success'| 'info'| 'warning'| 'danger';
    onDestroy: () => void;
    offset?: number;
    zIndex: number;
    id: string;
    transitionName?: string;
}

export interface MessageContext {
    id: string;
    vnode: VNode;
    props: MessageProps;
    vm: ComponentInternalInstance;
    destroy: () => void;
}

// 从 MessageProps 类型中排除了名为 onDestory 的属性，因为程序会自动传入
export type CreateMessageProps = Omit<MessageProps, 'onDestroy' | 'id' | 'zIndex'>

