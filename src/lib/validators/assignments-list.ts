export const areAssignmentsIdsValid = (str: string) => {
  const pattern = /^\d+(,?;? ?\d+)*$/
  return pattern.test(str.trim())
}
