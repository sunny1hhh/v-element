export type SwitchValueType = boolean | string | number;
export interface SwtichProps {
  modelValue: SwitchValueType;
  disabled?: boolean;
  //用来存储激活和没被激活时候的文字，比如on和off
  activeText?: string;
  inactiveText?: string;
  //指定被激活后的value和没被激活后的value
  activeValue?: SwitchValueType;
  inactiveValue?: SwitchValueType;
  name?: string;
  id?: string;
  size?: 'small' | 'large';
}

export interface SwtichEmits {
  (e: 'update:modelValue', value: SwitchValueType) : void;
  (e: 'change', value: SwitchValueType): void;
}