<template>
  <div class="prerequisites-block">
    <BaseDropdown
      class="input dropdown"
      :value="correctPlaceholder"
      label="Пререквизиты темы"
      placeholder="Выберите пререквизиты"
      @input="(e) => prerequisiteSearchStringChanged(e)"
    >
      <template #default="{closeMenu}">
        <SelectItem
          v-for="(item, index) in $prerequisitesList"
          :key="index"
          :with-icon="showTick(item.id)"
          @click="handleClick(item.id, item.title, closeMenu)"
        >
          {{ item.title }}
        </SelectItem>
      </template>
    </BaseDropdown>
    <div class="selected-prerequisite">
      <div
        v-for="(item, index) in $selectedPrerequisites"
        :key="index"
        class="element"
        @contextmenu.prevent="showPrerequisiteMenu(item.id)"
      >
        <p> {{ item.title }} </p>
        <div
          class="icon-wrapper"
          @click="deletePrerequisite(item.id)"
        >
          <Icon
            type="close"
            size="10"
            class="icon"
          />
        </div>
        <PrerequisiteMenu
          :ref="`menu-${item.id}`"
          :prerequisite-id="item.id"
          class="menu"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import PrerequisiteMenu from '@/pages/theme-creation/parts/prerequisites/PrerequisiteMenu.vue'
import {
  $prerequisitesList,
  deletePrerequisite,
  $prerequisite,
  prerequisiteChanged,
  $prerequisiteSearchString,
  resetSearchString,
  prerequisiteSearchStringChanged,
  $selectedPrerequisites,
  setSelectedPrerequisite,
} from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
    Icon,
    PrerequisiteMenu,
  },
  effector: {
    $prerequisitesList,
    $prerequisite,
    $prerequisiteSearchString,
    $selectedPrerequisites,
  },
  computed: {
    correctPlaceholder() {
      const name = this.$selectedPrerequisites.filter((el: any) => el.id === this.$prerequisite)
      return name.length ? name[0].title : this.$prerequisiteSearchString
    },
  },
  methods: {
    deletePrerequisite,
    prerequisiteChanged,
    prerequisiteSearchStringChanged,
    setSelectedPrerequisite,
    handleClick(itemId: number, itemTitle: string, cb: any) {
      prerequisiteChanged(itemId)
      setSelectedPrerequisite({ id: itemId, title: itemTitle })
      resetSearchString()
      cb()
    },
    showPrerequisiteMenu(itemId: number) {
      let currentComponent = ''
      Object.keys(this.$refs).forEach((el) => {
        if (!el.includes(`menu-${itemId}`) && (this.$refs[el] as any)[0].opened)
          (this.$refs[el] as any)[0].$refs.tooltip.hideTooltip()
        if (el.includes(`menu-${itemId}`)) currentComponent = el
      })
      ;(this.$refs[currentComponent] as any)[0].$refs.tooltip.toggleTooltip()
    },
    showTick(itemId: number) {
      return !!this.$selectedPrerequisites.find((el: any) => el.id === itemId)
    },
  },
})
</script>

<style scoped>
.prerequisites-block {
  .selected-prerequisite {
    @mixin flex-row-central;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: -10px;
    flex-wrap: wrap;
    .element {
      width: fit-content;
      height: 30px;
      padding: 0 10px;
      @mixin flex-row-central;
      background-color: var(--c-grey-8);
      border-radius: 6px;
      position: relative;
      p {
        font-weight: 300;
        line-height: 16px;
      }
      .icon-wrapper {
        width: 24px;
        height: 24px;
        @mixin flex-center;
        margin-left: 10px;
      }
      .icon {
        &:hover {
          cursor: pointer;
        }
      }
      .menu {
        position: absolute;
        right: 0;
      }
    }
    .element {
      margin-bottom: 10px;
    }
  }
}
</style>
