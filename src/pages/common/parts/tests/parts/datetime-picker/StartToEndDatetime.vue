<template>
  <div class="datetime-form">
    <div class="datetime-item">
      <span class="label">{{ label }} начала</span>
      <DatePicker              
        v-model="$datetime.start"
        type="datetime"
        placeholder="Выберите дату и время"
        @input="$emit('input', $datetime)"
      />
    </div>
    <div class="datetime-item">
      <span class="label">{{ label }} окончания</span>
      <DatePicker              
        v-model="$datetime.end"
        class="datepicker"
        type="datetime"
        placeholder="Выберите дату и время"
        @input="$emit('input', $datetime)"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

import { $datetime } from '@/pages/common/parts/tests/parts/datetime-picker/start-to-end-datetime.model'

export default Vue.extend({
  name: 'StartToEndDatetime',
  components: {
    DatePicker,
  },
  props: {
    label: { type: String, default: '' },
  },
  effector: {
    $datetime,
  },
})
</script>

<style scoped>
.datetime-form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.datetime-item {
  display: flex;
  flex-direction: column;
}
.datetime-item + .datetime-item {
  margin-left: 10px;
}
.label {
  color: #000;
  font-weight: 600;
  line-height: 17px;
  margin-bottom: 5px;
}
.close {
  cursor: pointer;
  margin-left: 10px;
  margin-top: 20px;
  fill: var(--base-text-secondary);
}
</style>