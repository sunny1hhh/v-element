<script setup lang="ts">
  import Button from './components/Button/Button.vue';
  import Collapse from './components/Collapse/Collapse.vue'
  import CollapseItem from './components/Collapse/CollapseItem.vue'
  import Icon from './components/Icon/Icon.vue'
  import Tooltip from './components/Tooltip/Tooltip.vue'
  import Dropdown from './components/Dropdown/Dropdown.vue'
  import Message from './components/Message/Message.vue'
  import Input from './components/Input/Input.vue'
  import Switch from './components/Switch/Switch.vue'
  import type {ButtonInstance} from './components/Button/types'
  import {ref, onMounted, h} from 'vue'
  import type { TooltipInstance } from './components/Tooltip/types'
  import type { MenuOption } from './components/Dropdown/types'
  import { createMessage } from './components/Message/method'

  const buttonRef = ref<null | ButtonInstance>(null)
  const tooltipRef = ref<TooltipInstance | null>(null)
  const trigger = ref<any>('hover')
  const openValue = ref(['a'])
  let val = ref('')

  const options: MenuOption[] = [
    { key: 1, label: h('b', 'this is bold') },
    { key: 2, label: 'item2', disabled: true },
    { key: 3, label: 'item3', divided: true },
    { key: 4, label: 'item4' }
  ]

  const open = () => {
    tooltipRef.value?.show()
  }

  const close = () => {
    tooltipRef.value?.hide()
  }

  onMounted(() => {
    createMessage({ message: 'hello world',showClose: true, duration: 0, type: 'success' })
    createMessage({ message: 'hello world',showClose: true, duration: 0, type: 'warning'  })
    createMessage({ message: 'hello world',showClose: true, type: 'danger'  })

    if(buttonRef.value){
      console.log('buttonRef', buttonRef.value.ref);
    }

  })




</script>

<template>
  <main>


    <!-- <Button type="primary" plain ref="buttonRef">Test Button</Button> -->
    <Button ref="buttonRef" @click="open">Test Button</Button>
    <Button plain @click="close">Plain Button</Button>
    <Button round>Round Button</Button>
    <Button circle>VK</Button>
    <Button disabled>Disabled Button</Button><br/><br/>
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="info">Info</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button><br/><br/>
    <Button type="primary" plain>Primary</Button>
    <Button type="success" plain>Success</Button>
    <Button type="info" plain>Info</Button>
    <Button type="warning" plain>Warning</Button>
    <Button type="danger" plain>Danger</Button><br/><br/>
    <Button size="large">Large</Button>
    <Button size="small">Small</Button><br/><br/>
    <Button size="large" loading>Loading</Button>
    <Button size="large" icon="arrow-up">Icon</Button><br/><br/>

    <Collapse v-model="openValue" accordion>
      <CollapseItem name="a" title="Title A">
        <h1>headline title</h1>
        <div> this is content a aaa </div>
      </CollapseItem>
      <CollapseItem name="b" title="Title B">
        <div> this is bbbbb test </div>
      </CollapseItem>
      <CollapseItem name="c" title="Disabled Title" disabled>
        <div> this is cccc test </div>
      </CollapseItem>
    </Collapse>

    {{ openValue }}

    <Dropdown
      placement="bottom"
      :trigger="trigger"
      :menu-options="options"
      manual
      ref="tooltipRef"
    >
      <Icon icon="arrow-up" spin type="danger"/>
    </Dropdown>

    <Input :show-password="true" v-model="val"></Input>

    <Switch :model-value="false" activeText="on" inactiveText="off"></Switch>


    <!-- <Message message="hello xxm" showClose></Message> -->
  </main>
</template>

<style scoped>

</style>
