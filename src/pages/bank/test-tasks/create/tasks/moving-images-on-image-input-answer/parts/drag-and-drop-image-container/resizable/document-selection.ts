export const disableDocumentSelection = () => {
  document.body.style.userSelect = 'none'
}

export const enableDocumentSelection = () => {
  document.body.style.userSelect = 'auto'
}
