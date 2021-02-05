<template>
  <div class="themes-block">
    <BaseDropdown
      class="input dropdown"
      :value="correctPlaceholder"
      label="Темы, к которым привязан пререквизит"
      placeholder="Выберите тему"
      @input="(e) => themeSearchStringChanged(e)"
    >
      <template #default="{closeMenu}">
        <div v-if="$themesList.length">
          <SelectItem
            v-for="(item, index) in $themesList"
            :key="index"
            @click="handleClick(item.id, item.title, closeMenu)"
          >
            {{ item.title }}
          </SelectItem>
        </div>
        <div v-else>
          <SelectItem @click="closeMenu">
            Не найдено совпадений
          </SelectItem>
        </div>
      </template>
    </BaseDropdown>
    <div class="selected-themes">
      <div
        v-for="(item, index) in $selectedThemes"
        :key="index"
        class="element"
      >
        <p> {{ item.title }} </p>
        <div
          class="icon-wrapper"
          @click="deleteTheme(item.id)"
        >
          <Icon
            type="close"
            size="10"
            class="icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseDropdown from '@/ui/dropdown/BaseDropdown.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $themesList,
  deleteTheme,
  $theme,
  themeChanged,
  $themeSearchString,
  resetSearchString,
  themeSearchStringChanged,
  $selectedThemes,
  setSelectedTheme,
} from '@/pages/theme-creation/parts/themes/themes.model'

export default Vue.extend({
  components: {
    BaseDropdown,
    SelectItem,
    Icon,
  },
  effector: {
    $themesList,
    $theme,
    $themeSearchString,
    $selectedThemes,
  },
  computed: {
    correctPlaceholder() {
      const name = this.$selectedThemes.filter((el: any) => el.id === this.$theme)
      return name.length ? name[0].title : this.$themeSearchString
    },
  },
  methods: {
    deleteTheme,
    themeChanged,
    themeSearchStringChanged,
    setSelectedTheme,
    handleClick(itemId: number, itemTitle: string, cb: any) {
      themeChanged(itemId)
      setSelectedTheme({ id: itemId, title: itemTitle })
      resetSearchString()
      cb()
    },
  },
})
</script>

<style scoped>
.themes-block {
  .selected-themes {
    @mixin flex-row-central;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: -10px;
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
    }
    .element {
      margin-bottom: 10px;
    }
  }
}
</style>
