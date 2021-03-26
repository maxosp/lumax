<template>
  <div class="tags-dropdown">
    <BaseDropdown
      class="input dropdown"
      value="Выберите теги"
      label="Теги"
      placeholder=""
      read-only-dropdown
      :disabled="disabled"
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$tags.length">
          <SelectItem
            v-for="item in $tags"
            :key="item.name"
            :with-icon="showTick(item)"
            :placeholder="item.title"
            @click="onSelectItem(item, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </div>
        <div v-else>
          <SelectItem @click="closeMenu">Нет созданных тегов</SelectItem>
        </div>
      </template>
    </BaseDropdown>
    <div class="selected-tags">
      <div
        v-for="item in $selectedTags"
        :key="item.name"
        class="tag"
      >
        <span>{{ item.title }}</span>
        <Icon
          type='close'
          class='close'
          size="8"
          @click="onRemoveItem(item)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import {
  $tags,
  $selectedTags,
  setSelectedTags,
} from '@/pages/bank/olympiad-tasks/edit/parts/tags-dropdown/tags-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    Icon,
    BaseDropdown,
    SelectItem,
  },
  props: {
    disabled: { type: Boolean },
  },
  effector: {
    $tags,
    $selectedTags,
  },
  methods: {
    showTick(item: any) {
      if (this.$selectedTags.find((tag) => +tag.name === +item.name)) return true
      return false
    },
    onSelectItem(item: DropdownItem, cb: any) {
      const existedItem = this.$selectedTags.find((tag: DropdownItem) => tag.name === item.name)
      if (existedItem) {
        const tags = this.$selectedTags.filter((tag: DropdownItem) => tag.name !== item.name)
        setSelectedTags(tags)
      } else {
        setSelectedTags([item, ...this.$selectedTags])
      }
      cb()
    },
    onRemoveItem(item: DropdownItem) {
      const tags = this.$selectedTags.filter((tag: DropdownItem) => tag.name !== item.name)
      setSelectedTags(tags)
    },
    clear() {
      // clear handle
    },
  },
})
</script>

<style scoped>
.selected-tags {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.tag {
  color: #000;
  line-height: 16px;
  padding: 7px 10px;
  background-color: var(--c-grey-8);
  border-radius: 6px;
  margin: 0 10px 10px 0;
}
.close {
  cursor: pointer;
  margin-left: 10px;
  fill: var(--c-grey-3);
}
</style>
