<template>
  <div class="themes-block">
    <FilterDropdown
      label="Темы, к которым привязан пререквизит"
      placeholder="Выберите тему"
      :methods="themeModuleMethods"
      :data="$themes"
      :store="{ $item, $itemsDropdown, $searchString }"
      :selected-data="$selectedThemes"
      is-recursive
    />
    <div class="selected-themes">
      <div
        v-for="(item, index) in $selectedThemes"
        :key="index"
        class="element"
      >
        <p> {{ item.title }} </p>
        <div
          class="icon-wrapper"
          @click="deleteTheme(item.name)"
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
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  deleteTheme,
  $themes,
  $selectedThemes,
  themeDropdownModule,
} from '@/pages/dictionary/themes/create/parts/themes/themes.model'

export default Vue.extend({
  components: {
    FilterDropdown,
    Icon,
  },
  effector: {
    $themes,
    ...themeDropdownModule.store,
    $selectedThemes,
  },
  data() {
    return {
      themeModuleMethods: themeDropdownModule.methods,
    }
  },
  methods: {
    deleteTheme,
  },
})
</script>

<style scoped>
.themes-block {
  .selected-themes {
    @mixin flex-row-central;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: -10px;
    .element {
      width: fit-content;
      min-height: 30px;
      padding: 7px 10px;
      @mixin flex-row-central;
      background-color: var(--c-grey-8);
      border-radius: 6px;
      position: relative;
      margin-bottom: 10px;
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
    .element:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
