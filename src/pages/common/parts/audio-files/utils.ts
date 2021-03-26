export const getReadableDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  const mm = `${minutes}`.length === 1 ? `0${minutes}` : minutes
  const ss = `${seconds}`.length === 1 ? `0${seconds}` : seconds

  return `${mm}:${ss}`
}
