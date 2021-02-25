<template>
  <div class="tags-dropdown">
    <BaseDropdown
      class="input dropdown"
      value="Выберите теги"
      label="Теги"
      placeholder=""
      read-only-dropdown
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$tags.length">
          <SelectItem
            v-for="item in $tags"
            :key="item.name"
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
  loadTags,
  $tags,
  $selectedTags,
  setSelectedTags,
} from '@/pages/task-creation/olympiad/parts/tags-dropdown/tags-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    Icon,
    BaseDropdown,
    SelectItem,
  },
  effector: {
    $tags,
    $selectedTags,
  },
  methods: {
    loadTags,
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
  mounted() {
    loadTags()
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