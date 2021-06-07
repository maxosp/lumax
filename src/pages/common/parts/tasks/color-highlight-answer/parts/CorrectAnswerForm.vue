<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <v-popover
      offset="16"
      placement="right"
      class="popover"
      :disabled="!$popover"
    >
      <BaseButton @click="togglePopover">
        Добавить цвет в палитру
      </BaseButton>
      <template #popover>
        <ColorPicker v-model="colors" />
        <div class="add-color-btn">
          <BaseButton yellow @click="addColor">Добавить</BaseButton>
        </div>
      </template>
    </v-popover>
    <div class="colors-palette">
      <div
        v-for="color in $colorsPalette"
        :key="color"
        class="color"
        :style="{ backgroundColor: color }"
      >
        <Icon
          type="close"
          class="icon-close"
          size="8"
          @click="removeColor(color)"
        />
      </div>
    </div>
    <div class="label">Текст</div>
    <Wysiwyg
      class="wysiwyg"
      editor-id="color-highlight-wysiwyg"
      listen-selection
      :editor-index="2"
      :value="$textTemplate"
      @input="setTextTemplate"
      @text-selected="setupContextMenu"
    />
    <div
      class="context-menu"
      :class="{ invisible: !$contextMenu }"
      :style="contextMenuStyle"
    >
      <div class="title">Выбери цвет</div>
      <div class="colors-palette">
        <div
          v-for="color in $colorsPalette"
          :key="color"
          class="color"
          :class="{ active: color === selectedColor }"
          :style="{ backgroundColor: color }"
          @click="setTextColor(color)"
        />
        <Icon
          type="remove"
          class="icon-remove"
          size="30"
          @click="removeTextColor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Chrome } from 'vue-color'
import Icon from '@/ui/icon/Icon.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $textTemplate,
  setTextTemplate,
  $popover,
  togglePopover,
  $contextMenu,
  toggleContextMenu,
  $colorsPalette,
  setColorsPalette,
} from '@/pages/common/parts/tasks/color-highlight-answer/color-highlight-answer.model'
import { errorToastEvent } from '@/features/toasts/toasts.model'

type SetupContextMenuArguments = {
  parentElementPosition: DOMRect
  mouseEvent: MouseEvent
  editor: any
}

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    ColorPicker: Chrome,
    Wysiwyg,
    BaseButton,
  },
  effector: {
    $textTemplate,
    $popover,
    $contextMenu,
    $colorsPalette,
  },
  data: () => ({
    editorWithSelection: {} as PropType<any>,
    selectedColor: '' as string | null,
    contextMenuStyle: {
      height: '100px',
      left: '0',
      top: '0',
    },
    colors: {
      hex: '#ffffff',
    },
  }),
  methods: {
    setTextTemplate,
    togglePopover() {
      togglePopover(!this.$popover)
    },
    toggleContextMenu() {
      toggleContextMenu(!this.$contextMenu)
    },
    addColor() {
      if (this.$colorsPalette.find((color) => color === this.colors.hex)) {
        errorToastEvent('Такой цвет уже существует!')
        return
      }
      setColorsPalette([...this.$colorsPalette, this.colors.hex])
      this.togglePopover()
    },
    removeColor(colorToRemove: string) {
      const palette = this.$colorsPalette.filter((color) => color !== colorToRemove)
      setColorsPalette(palette)
    },
    setupContextMenu({ parentElementPosition, mouseEvent, editor }: SetupContextMenuArguments) {
      let positionX = mouseEvent.x
      let positionY = parentElementPosition.top - parseInt(this.contextMenuStyle.height, 10)

      const farLeftPosition = parentElementPosition.left - 10
      const farRightPosition = parentElementPosition.right + 10
      if (mouseEvent.x > farRightPosition) {
        positionX = parentElementPosition.right
      }
      if (mouseEvent.x < farLeftPosition) {
        positionX = parentElementPosition.left
      }

      const contextMenuParentPosition = this.$el.getClientRects()[0]
      positionX -= contextMenuParentPosition.left
      positionY -= contextMenuParentPosition.top

      this.contextMenuStyle = {
        ...this.contextMenuStyle,
        top: `${positionY}px`,
        left: `${positionX}px`,
      }
      this.editorWithSelection = editor
      toggleContextMenu(true)
    },
    setTextColor(color: string) {
      this.selectedColor = color
      const editor = this.editorWithSelection

      const content = `<span style="background-color: ${color}" it-fill="${color}" own-color="${color}">${
        /* @ts-ignore */
        editor.getSelectedHtml().$.textContent
      }</span>`
      /* @ts-ignore */
      editor.insertHtml(content, 'unfiltered_html')
      toggleContextMenu(false)
    },
    removeTextColor() {
      /* @ts-ignore */
      const selectedString = this.editorWithSelection.getSelectedHtml(true)
      const clearedString = selectedString.replace(
        /<span\sstyle="[^"]+"\sit-fill="[^"]+"\sown-color="[^"]+">[^<]+<\/span>/gm,
        (match: string) => {
          return match.replace(/(<span[^>]+>|<\/span>)/, '')
        }
      )
      /* @ts-ignore */
      this.editorWithSelection.insertHtml(clearedString, 'unfiltered_html')
      toggleContextMenu(false)
    },
  },
})
</script>

<style>
.popover-inner {
  background-color: #fff !important;
  box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.17);
}

.vc-chrome {
  box-shadow: none !important;
}

.vc-chrome-body {
  padding-bottom: 0px !important;
}
</style>

<style scoped>
.question-answers-form {
  position: relative;
  display: flex;
  flex-direction: column;
}

.left-border {
  position: absolute;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-1);
}

.label {
  font-weight: bold;
  line-height: 17px;
  margin-bottom: 5px;
}

.wysiwyg,
.popover,
.colors-palette {
  margin-bottom: 20px;
}

.colors-palette {
  display: flex;
  align-items: center;
}

.color {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  & + .color {
    margin-left: 25px;
  }
}

.icon-close {
  fill: #fff;
}

.icon-remove {
  cursor: pointer;
  stroke: var(--base-text-secondary);
  margin-left: 25px;
}

.add-color-btn {
  display: flex;
  justify-content: center;
}

.context-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  border-radius: 7px;
  padding: 20px 20px 0 20px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 17px;
}

.invisible {
  display: none;
}
</style>
