<template>
  <BaseHeader>
    <template #left>
      <div :class="{ 'header-logo': true, opened: $isOpened }">
        <router-link :to="{ name: 'home' }">
          <HeaderLogo />
        </router-link>
      </div>
    </template>
    <template #center>
      <div class="nav-state-switcher">
        <Icon
          class="sidebar"
          type="sidebar"
          size="20"
          @click="changeNavState(!$isOpened)"
        />
      </div>
    </template>
    <template #right>
      <div class="header-auth">
        <HeaderLink route-name="user.profile">
          Никита Махаев
        </HeaderLink>
        <div
          class="element"
          @click="modalLogoutVisibilityChanged(true)"
        >
          <p>Выход</p>
        </div>
      </div>
    </template>
  </BaseHeader>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseHeader from '@/ui/header/BaseHeader.vue'
import Icon from '@/ui/icon/Icon.vue'
import HeaderLogo from '@/pages/common/parts/header/HeaderLogo.vue'
import HeaderLink from '@/pages/common/parts/header/HeaderLink.vue'
import { $isOpened, changeNavState } from '@/pages/common/navigation/navigation.model.ts'
import { modalLogoutVisibilityChanged } from '@/pages/common/modal-logout/modal-logout.model'
// import { $isAuthed } from '@/features/session'

export default Vue.extend({
  name: 'PageHeader',
  components: { BaseHeader, Icon, HeaderLogo, HeaderLink },
  effector: {
    // $isAuthed,
    $isOpened,
  },
  methods: {
    changeNavState,
    modalLogoutVisibilityChanged,
  },
})
</script>

<style scoped>
.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  transition: width var(--base-animation);
}
.opened {
  width: 240px;
}
.header-auth {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 300px;
  padding-right: 30px;

  .element {
    font-weight: 700;
    line-height: 17px;
    color: var(--base-text-primary);
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }
}
.nav-state-switcher {
  display: flex;
  align-items: center;
  padding-left: 30px;
}
.sidebar {
  cursor: pointer;
}
</style>



