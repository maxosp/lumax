import { config } from '@/config'

export const url = 'https://cdn.ckeditor.com/4.16.0/full-all/ckeditor.js'

export const wysiwygConfig = {
  title: false,
  language: 'ru',
  extraPlugins: 'uploadimage, divarea',
  removePlugins: 'easyimage, cloudservices, exportpdf',
  uploadUrl: `${config.BACKEND_URL}/api/media/media/upload/`,
  allowedContent: true,
  toolbar: [
    [
      'Bold',
      'Italic',
      'Underline',
      'Strike',
      'Subscript',
      'Superscript',
      'JustifyLeft',
      'JustifyCenter',
      'JustifyRight',
      'Font',
      'TextColor',
      'BGColor',
      'FontSize',
      'Format',
    ],
    '/',
    ['BulletedList', 'NumberedList', 'Link', 'Table', 'Image', 'Iframe', 'Maximize', 'Source'],
  ],
  removeButtons: '',
  editorplaceholder: '',
}

export const enableRules = (e: any): void => {
  const { writer } = e.editor.dataProcessor
  const rules = {
    indent: false,
    breakBeforeOpen: false,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: false,
  }
  writer.setRules('p', rules)
  writer.setRules('ul', rules)
  writer.setRules('li', rules)
  writer.setRules('ol', rules)
  writer.setRules('blockquote', rules)
  writer.setRules('table', rules)
  writer.setRules('theader', rules)
  writer.setRules('tbody', rules)
  writer.setRules('tr', rules)
  writer.setRules('td', rules)
  writer.setRules('caption', rules)
  writer.setRules('hr', rules)
  writer.setRules('div', rules)
  writer.setRules('address', rules)
  writer.setRules('pre', rules)
}
