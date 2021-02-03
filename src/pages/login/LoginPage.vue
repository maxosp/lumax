<template>
  <LoginLayout>
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
          Вход
        </BaseButton>
      </form>
    </Card>
  </LoginLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginLayout from '@/layouts/LoginLayout.vue'
import Card from '@/ui/card/Card.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $form,
  emailChanged,
  passwordChanged,
  $errors,
  $isFormValid,
  submitForm,
} from '@/pages/login/login.model'

export default Vue.extend({
  name: 'LoginPage',
  components: {
    LoginLayout,
    Card,
    FormInput,
    BaseButton,
  },
  effector: {
    $form,
    $errors,
    $isFormValid,
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
  }
}
.logo {
  width: 160px;
  height: 60px;
}
</style>
