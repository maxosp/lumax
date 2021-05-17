export const areAssignmentsIdsValid = (str: string) => {
  const pattern = /^\d+(,{1}\d+)*$/
  return pattern.test(str.trim())
}
