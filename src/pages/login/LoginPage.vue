<template>
  <Card class="card">
    <img
      src='~assets/img/logo-full.svg'
      alt="logo"
      class="logo"
    >
    <form @submit.prevent>
      <FormInput
        :value="$form.email"
        label="Email"
        :max-length="100"
        placeholder="Введите ваш email"
        :error-message="$errors.email"
        class="input"
        @input="emailChanged"
      />
      <FormInput
        :value="$form.password"
        type="password"
        label="Пароль"
        :max-length="100"
        placeholder="Введите ваш пароль"
        :error-message="$errors.password"
        class="input"
        @input="passwordChanged"
      />
      <BaseButton
        class="btn"
        big
        :disabled="!$isFormValid"
        @click="submitForm"
      >
        {{ $isLoading ? '' : 'Вход'}}
        <Loader v-if="$isLoading" />
      </BaseButton>
    </form>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Loader from '@/pages/common/parts/loader/Loader.vue'
import {
  $form,
  emailChanged,
  passwordChanged,
  $errors,
  $isFormValid,
  submitForm,
  $isLoading,
} from '@/pages/login/login.model'

export default Vue.extend({
  name: 'LoginPage',
  components: {
    Card,
    FormInput,
    BaseButton,
    Loader,
  },
  effector: {
    $form,
    $errors,
    $isFormValid,
    $isLoading,
  },
  methods: {
    emailChanged,
    passwordChanged,
    submitForm,
  },
})
</script>

<style scoped>
.card {
  width: 420px;
}
form {
  width: 100%;
  margin-top: 40px;
  .input:first-child {
    margin-bottom: 15px;
  }
  .btn {
    margin-top: 20px;
    width: 100%;
  }
}
.logo {
  width: 160px;
  height: 60px;
}
</style>
