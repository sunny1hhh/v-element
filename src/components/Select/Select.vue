<template>
    <div
        class="vk-select"
        :class="{'is-disabled': disabled }"
        @click="toggleDropdown"
        @mouseenter="states.mouseHover = true"
        @mouseleave="states.mouseHover = false"
    >
        <Tooltip
            placement="bottom-start"
            manual
            ref="tooltipRef"
            :popper-options="popperOptions"
            @click-outside="controlDropdown(false)"
        >
            <Input
                v-model="states.inputValue"
                :disabled="disabled"
                :placeholder="filteredPlaceholder"
                :readonly="!filterable || !isDropdownShow"
                ref="inputRef"
                @input="debounceOnFilter"
                @keydown="handleKeydown"
            >
                <template #suffix>
                    <Icon
                        icon="circle-xmark"
                        v-if="showClearIcon"
                        class="vk-input__clear"
                        @click.stop="onClear"
                        @mousedown.prevent="NOOP"
                    />
                    <Icon
                        v-else
                        icon="angle-down"
                        class="header-angle"
                        :class="{ 'is-active': isDropdownShow }"
                    />
                </template>
            </Input>
            <template #content>
                <div class="vk-select__loading" v-if="states.loading"><Icon icon="spinner" spin/></div>
                <div class="vk-select__nodata" v-else-if="filterable && filteredOptions.length === 0">no matching data</div>
                <ul class="vk-select__menu" v-else>
                    <template v-for="(item, index) in filteredOptions" :key="item.value">
                        <li
                            class="vk-select__menu-item"
                            :class="{
                                'is-disabled': item.disabled,
                                'is-selected': states.selectedOption?.value === item.value,
                                'is-highlighted': states.highlightIndex === index
                            }"
                            :id="`select-item-${item.value}`"
                            @click.stop="itemSelect(item)"
                        >
                            <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label" />
                        </li>
                    </template>
                </ul>
            </template>
        </Tooltip>
    </div>
</template>

<script setup lang="ts">
    import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types';
    import { ref, reactive, computed, watch } from 'vue';
    import type { Ref } from 'vue';
    import Tooltip from '../Tooltip/Tooltip.vue';
    import Input from '../Input/Input.vue';
    import Icon from '../Icon/Icon.vue'
    import type { TooltipInstance } from '../Tooltip/types';
    import type { InputInstance } from '../Input/types';
    import RenderVnode from '../Common/RenderVnode'
    import { isFunction, debounce } from 'lodash-es';

    defineOptions({
        name: 'VkSelect'
    })

    const popperOptions: any = {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 9],
                },
            },
            {
                name: "sameWidth",
                enabled: true,
                fn: ({ state }: { state: any }) => {
                    state.styles.popper.width = `${state.rects.reference.width}px`;
                },
                phase: "beforeWrite",
                requires: ["computeStyles"],
            }
        ],
    }

    const props = withDefaults(defineProps<SelectProps>(), {
        // 设置空数组会有类型报错，我们可以使用回调函数的形式赋初始值
        options: () => []
    })
    const emits = defineEmits<SelectEmits>()

    const NOOP = () => {}
    // 寻找选中的option
    const findOption = (value: string | number) => {
        const option = props.options.find(option => option.value === value)
        return option ? option : null
    }
    const initialOption = findOption(props.modelValue)
    // 获取Tooltip实例
    const tooltipRef = ref() as Ref<TooltipInstance>
    const inputRef = ref() as Ref<InputInstance>
    // 远程请求用到的防抖函数的时间控制
    const timeout = computed(() => (props.remote ? 300 : 0))
    //表示下拉框是否被打开，初始值为FALSE
    const isDropdownShow = ref(false)
    // 下拉框选中的内容和input的value
    const states = reactive<SelectStates>({
        inputValue: initialOption ? initialOption.label : '',
        selectedOption: initialOption,
        mouseHover: false,
        loading: false,
        highlightIndex: -1
    })

    watch(() => props.modelValue, async (newValue) => {
        const updateOption = findOption(newValue)
        states.inputValue = updateOption ? updateOption.label : ''
        states.selectedOption = updateOption
        const updatedValue = updateOption ? updateOption.value : ''
        emits('change', updatedValue)
        emits('update:modelValue', updatedValue)
    })

    // 过滤后的options，注意这里要监视，不然无法获取最新值
    const filteredOptions = ref<SelectOption[]>(props.options)
    watch(() => props.options, (newOptions) => {
        filteredOptions.value = newOptions
    })
    // 选项筛选更新函数
    const generateFilterOptions = async (searchValue: string) => {
        if(!props.filterable) return
        // 如果是自定义函数则调用自定义函数进行处理，不是自定义函数则按照数组的处理方式
        if(props.filterMethod && isFunction(props.filterMethod)){
            filteredOptions.value = props.filterMethod(searchValue)
        } else if(props.remote && props.remoteMethod && isFunction(props.remoteMethod)){
            states.loading = true
            try{
                filteredOptions.value = await props.remoteMethod(states.inputValue)
            }catch(e){
                console.error(e)
                filteredOptions.value = []
            }finally{
                states.loading = false
            }
        }else {
            filteredOptions.value = props.options.filter(option => option.label.includes(searchValue))
        }
        states.highlightIndex = -1
    }
    // 便于理解，可以在input事件里面调用
    const onFilter = () => {
        generateFilterOptions(states.inputValue)
    }

    // 防止发送多次请求，只发送最后一次请求
    const debounceOnFilter = debounce(() => {
        onFilter()
    }, timeout.value)

    // 添加键盘事件
    const handleKeydown = (e: KeyboardEvent) => {
        switch(e.key){
            case 'Enter':
                if(!isDropdownShow.value){
                    controlDropdown(true)
                }else{
                    // 选择选项
                    if(states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]){
                        itemSelect(filteredOptions.value[states.highlightIndex])
                    }else{
                        controlDropdown(false)
                    }
                }
                break
            case 'Escape':
                if(isDropdownShow.value){
                    controlDropdown(false)
                }
                break
            case 'ArrowUp':
                e.preventDefault()
                if(isDropdownShow.value){
                    if(filteredOptions.value.length > 0){
                        if(states.highlightIndex === -1 || states.highlightIndex === 0){
                            states.highlightIndex = filteredOptions.value.length - 1
                        }else{
                            states.highlightIndex--
                        }
                    }
                }
                break
            case 'ArrowDown':
                e.preventDefault()
                if(isDropdownShow.value){
                    if(filteredOptions.value.length > 0){
                        if(states.highlightIndex === -1 || states.highlightIndex === (filteredOptions.value.length - 1)){
                            states.highlightIndex = 0
                        }else{
                            states.highlightIndex++
                        }
                    }
                }
                break
            default:
                break
        }
    }

    // clear function
    const showClearIcon = computed(() => {
        // hover进去，并且有值(有待思考), 并且必须要有选择过选项
        return props.clearable
        && states.mouseHover
        && states.inputValue.trim() !== ''
        && states.selectedOption
    })

    // 设置placeholder
    const filteredPlaceholder = computed(() => {
        // 让选项显示为placeholder的条件是：打开过滤模式、已经有选项和下拉框显示
        return (props.filterable && states.selectedOption && isDropdownShow.value)
        ? states.selectedOption.label : props.placeholder
    })

    const controlDropdown = (show: boolean) => {
        if(show){
            // filter模式并且有选项选择，就清空input框中的内容
            if(props.filterable && states.selectedOption){
                states.inputValue = ''
            }
            // 进行一次默认选项的生成
            if(props.filterable){
                generateFilterOptions(states.inputValue)
            }
            tooltipRef.value.show()
        }else{
            // 把值回灌到input中
            if(props.filterable){
                states.inputValue = states.selectedOption ? states.selectedOption.label : ''
            }
            states.highlightIndex = -1
            tooltipRef.value.hide()
        }
        isDropdownShow.value = show
        emits('visible-change', show)
    }

    const toggleDropdown = () => {
        if(props.disabled) return
        if(isDropdownShow.value){
            controlDropdown(false)
        }else{
            controlDropdown(true)
        }
    }

    // 设置点击事件，将下拉框选择的内容呈现到input里面
    const itemSelect = (e: SelectOption) => {
        if(e.disabled) return
        states.inputValue = e.label
        states.selectedOption = e
        // 发射事件
        emits('change', e.value)
        emits('update:modelValue', e.value)
        controlDropdown(false)
        // 选完后再次获取焦点
        inputRef.value.ref.focus()
    }

    // 清除按钮点击事件
    const onClear = () => {
        states.selectedOption = null
        states.inputValue = ''
        emits('clear')
        emits('change', '')
        emits('update:modelValue', '')
    }

</script>