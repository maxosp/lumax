<template>
  <div class="teaching-resources">
    <p class="title"> Обучающие ресурсы </p>
    <p v-if="$teachingResources && !$teachingResources.length" class="description"> Обучающие ресурсы еще не добавлены </p>
    <div
      v-for="resource in $teachingResources"
      :key="resource.id"
      class="resource"
    >
      <div class="fake-icon">
        <Icon
          :type="`resource-${resource.resource_type}`"
          class="icon"
          :class="resource.resource_type"
          size="20"
        />
      </div>
      <p class="resource-title">{{ title(resource) }}</p>
      <div class="close" @click="deleteTeachingResource([resource.id])">
        <Icon
          class="close-icon"
          type="close"
          size="10"
        />
      </div>
    </div>
    <p class="underline" @click="redirectToResourceCreate"> Добавить ресурс </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $themeTitle,
  redirectToResourceCreate,
} from '@/pages/dictionary/themes/edit/theme-edition-page.model'
import { $selectedSubject } from '@/pages/dictionary/themes/edit/parts/subjects/subjects.model'
import { $selectedClass } from '@/pages/dictionary/themes/edit/parts/class/class.model'
import {
  deleteTeachingResource,
  setTeachingResources,
  setThemeId,
  $teachingResources,
} from '@/pages/dictionary/themes/edit/parts/teaching-resources/teaching-resources-page.model'
import { ResourceType } from '@/features/api/media/types'
import { removeHtmlTags } from '@/features/lib'

export default Vue.extend({
  components: {
    Icon,
  },
  effector: {
    $themeTitle,
    $selectedSubject,
    $selectedClass,
    $teachingResources,
  },
  methods: {
    redirectToResourceCreate,
    setTeachingResources,
    deleteTeachingResource,
    title(resource: ResourceType) {
      const type = resource.resource_type
      if (type === 'text') {
        return removeHtmlTags(resource.text)
      }
      if (type === 'file') {
        return resource.media?.file_name
      }
      return resource.text ? removeHtmlTags(resource.text) : resource.link
    },
  },
  mounted() {
    setThemeId(+this.$route.params.id)
  },
})
</script>

<style scoped>
.teaching-resources {
  margin-bottom: 30px;
  p {
    font-weight: 400;
    line-height: 17px;
    color: var(--base-text-primary);
  }
  p.title {
    font-weight: 600;
    margin-bottom: 16px;
  }
  p.underline {
    width: fit-content;
    font-weight: 600;
    margin-top: 20px;
    @mixin underline-text;
    &:hover {
      cursor: pointer;
    }
  }
}
.resource {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .resource-title {
    font-weight: 600;
    line-height: 17px;
    color: var(--base-text-primary);
  }
}
.fake-icon {
  @mixin flex-center;
  width: 30px;
  height: 30px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-right: 15px;
  .icon.text {
    fill: var(--base-text-secondary);
  }
  .icon.file {
    fill: transparent;
    stroke: var(--c-dark-0);
  }
  .icon.link {
    fill: transparent;
    stroke: var(--c-yellow-1);
  }
}
.close {
  @mixin flex-center;
  margin-left: 15px;
  cursor: pointer;
}
.close-icon {
  fill: var(--c-grey-3);
}
</style>
