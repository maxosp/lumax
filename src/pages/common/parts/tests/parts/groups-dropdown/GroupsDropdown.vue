<template>
  <div class="">
    <BaseDropdown
      class="input dropdown"
      :value="correctValue"
      label="Группа"
      placeholder="Выберите группу"
      @input="searchStringChanged"
      @clear="clear"
    >
      <template #default="{closeMenu}">
        <div v-if="$itemsDropdown.length">
          <SelectItem
            v-for="item in $itemsDropdown"
            :key="item.name"
            :placeholder="item.title"
            @click="onSelectItem(item, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </div>
        <div v-else>
          <SelectItem @click="closeMenu">Нет созданных групп</SelectItem>
        </div>
      </template>
    </BaseDropdown>
    <div class="selected-groups">
      <div
        v-for="(item, index) in $selectedGroups"
        :key="item.name"
        class="selected-group"
      >
        <Divider v-if="index" class="divider" />
        <div class="label">
          <span>{{ item.title }}</span>
          <Icon
            type='close'
            class='close'
            size="10"
            @click="onRemoveItem(item)"
          />
        </div>
        <div 
          v-for="(datetime, idx) in item.datetimes"
          :key="idx"
          class="group-datetime"
        >
          <StartToEndDatetime
            class="datetime-picker"
            label="Дата"
            @input="val => setDatetime({group_id: index, datetime_id: idx, datetime: val})"
          />
          <Icon
            type='close'
            class='close'
            size="10"
            @click="onRemoveDatetime({group_id: index, datetime_id: idx})"
          />
          <div
            class="icon-btn"
            @click="onAddDatetime(index)"
          >
            <Icon
              class="icon-plus"
              type="plus"
              size="12"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import Divider from '@/ui/divider/Divider.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import StartToEndDatetime from '@/pages/common/parts/tests/parts/datetime-picker/StartToEndDatetime.vue'
import {
  $groups,
  loadGroups,
  groupsDropdownModule,
  $selectedGroups,
  setSelectedGroups,
  setDatetime,
  $datetimes,
} from '@/pages/common/parts/tests/parts/groups-dropdown/groups-dropdown.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  name: 'GroupsDropdown',
  components: {
    Icon,
    BaseDropdown,
    Divider,
    SelectItem,
    StartToEndDatetime,
  },
  effector: {
    $groups,
    $datetimes,
    $selectedGroups,
    ...groupsDropdownModule.store,
  },
  computed: {
    correctValue(): string {
      const arr = [...this.$itemsDropdown]
      const currentItem = arr.find((el: DropdownItem) => el.name === this.$item)
      return currentItem ? currentItem.title : this.$searchString
    },
  },
  methods: {
    loadGroups,
    setDatetime,
    ...groupsDropdownModule.methods,
    onAddDatetime() {
      setDatetime(...this.$datetimes, {
        start: '',
        end: '',
      })
    },
    onSelectItem(item: DropdownItem, cb: any) {
      const existedItem = this.$selectedGroups.find(
        (label: DropdownItem) => label.name === item.name
      )
      if (existedItem) {
        const themes = this.$selectedGroups.filter(
          (label: DropdownItem) => label.name !== item.name
        )
        setSelectedGroups(themes)
      } else {
        setSelectedGroups([...this.$selectedGroups, item])
      }
      cb()
    },
    clear() {
      this.resetItem()
      this.resetSearchString()
    },
  },
  mounted() {
    loadGroups()
  },
})
</script>

<style scoped>
.divider {
  margin: 15px auto;
}
.label {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 6px;
  background: var(--c-grey-4);
}
.label span {
  color: var(--base-text-primary);
}
.selected-groups {
  margin-top: 10px;
}
.selected-group {
  display: flex;
  flex-direction: column;
}
.group-datetime {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.group-datetime .close {
  margin-top: 30px;
}
.datetime-picker {
  margin-top: 10px;
}
.close {
  cursor: pointer;
  margin-left: 10px;
  fill: var(--base-text-secondary);
}
.icon-btn {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-top: 30px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--base-text-primary);
}
.icon-plus {
  fill: #fff;
}
</style>