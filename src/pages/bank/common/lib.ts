export const formatFailToGetIdResponseMessage = (message: string) => {
  if (message) {
    const matchedId = message.match(/"\d+"/g)
    if (matchedId) {
      const formattedId = matchedId[0].replace(/"|\\/g, '')
      return `Задание с ID ${formattedId} не найдено`
    }
  }
  return 'Задание с таким ID не найдено'
}
