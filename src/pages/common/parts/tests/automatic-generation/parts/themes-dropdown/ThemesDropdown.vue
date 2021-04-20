<template>
  <div class="themes-dropdown">
    <BaseDropdown
      class="input dropdown"
      :disabled="disabled"
      :value="correctValue"
      label="Выбор тем"
      placeholder="Выберите темы"
      @input="searchStringChanged"
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$itemsDropdown.length">
          <SelectItemRecursive
            v-for="item in $itemsDropdown"
            :key="item.author"
            :item="item"
            :depth="0"
            :selected-item-id="+$item"
            :placeholder="item.title"
            :handle-click="(val) => onSelectItem(val, closeMenu)"
          />
        </div>
        <div v-else>
          <SelectItem @click="closeMenu">Нет созданных меток</SelectItem>
        </div>
      </template>
    </BaseDropdown>
    <div class="selected-themes">
      <Draggable      
        v-model="$selectedThemes"
        group="selectedThemes"
        handle=".handle"
        class="field"
        @end="handlerEnd"
      >
        <div
          v-for="(item, index) in $selectedThemes"
          :key="item.name"  
          class="selected-theme"
        >
          <div class="label">
            <span class="order">{{ index + 1 }}.</span>
            {{ item.title }}
          </div>        
          <Icon
            type='close'
            class='close'
            size="10"
            @click="onRemoveItem(item)"
          />
          <div class="handle">
            <Icon
              type="burger"
              class="icon-handle"
              size="12"
            />
          </div>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import Draggable from 'vuedraggable'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import SelectItemRecursive from '@/ui/select/parts/SelectItemRecursive.vue'
import {
  $selectedThemes,
  setSelectedThemes,
  themesDropdownModule,
} from '@/pages/common/parts/tests/automatic-generation/parts/themes-dropdown/themes-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    Icon,
    BaseDropdown,
    Draggable,
    SelectItem,
    SelectItemRecursive,
  },
  props: {
    disabled: { type: Boolean as PropType<boolean> },
  },
  effector: {
    $selectedThemes,
    ...themesDropdownModule.store,
  },
  computed: {
    correctValue(): string {
      const arr = [...this.$itemsDropdown]
      const currentItem = arr.find((el: DropdownItem) => el.name === this.$item)
      return currentItem ? currentItem.title : this.$searchString
    },
  },
  methods: {
    ...themesDropdownModule.methods,
    itemsReorder(items: DropdownItem[]) {
      return items.map((item, index) => ({
        ...item,
        id: index,
      }))
    },
    onSelectItem(item: DropdownItem, postAction: () => void) {
      const existedItem = this.$selectedThemes.find(
        (label: DropdownItem) => label.name === item.name
      )
      if (existedItem) {
        let themes = this.$selectedThemes.filter((label: DropdownItem) => label.name !== item.name)
        themes = this.itemsReorder(themes)
        setSelectedThemes(themes)
      } else {
        const themes = this.itemsReorder([...this.$selectedThemes, item])
        setSelectedThemes(themes)
      }
      postAction()
    },
    onRemoveItem(item: DropdownItem) {
      const themes = this.$selectedThemes.filter((label: DropdownItem) => label.name !== item.name)
      setSelectedThemes(themes)
    },
    handlerEnd() {
      const themes = this.$selectedThemes.map((theme, id) => ({ ...theme, id }))
      setSelectedThemes(themes)
    },
    clear() {
      this.resetItem()
      this.resetSearchString()
    },
  },
})
</script>

<style scoped>
.selected-themes {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.selected-theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.select-item {
  justify-content: start;
}
.label {
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 40px;
  border-radius: 5px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  padding: 20px;
}
.order {
  margin-right: 20px;
}
.close {
  cursor: pointer;
  margin-left: 20px;
  fill: var(--base-text-secondary);
}
.handle,
.icon-btn {
  margin-left: 10px;
}
.handle {
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 36px;
  height: 36px;
  border-radius: 7px;
}
.icon-handle {
  fill: var(--c-grey-3);
}
</style>