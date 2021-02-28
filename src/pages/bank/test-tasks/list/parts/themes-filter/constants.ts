export const DEFAULT_TOGGLERS = {
  hide_prerequisites: false,
  show_only_prerequisites: false,
  show_without_tasks: false,
  show_with_tasks: false,
}

export const mapTogglerToEntity = {
  hide_prerequisites: {
    name: 'is_prerequisite',
    value: 'false',
  },
  show_only_prerequisites: {
    name: 'is_prerequisite',
    value: 'true',
  },
  show_without_tasks: {
    name: 'has_assignment',
    value: 'false',
  },
  show_with_tasks: {
    name: 'has_assignment',
    value: 'true',
  },
}
