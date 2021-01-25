const parseQueryStringFactory = (URLSearch: typeof URLSearchParams) => <T = {}>(
  string: string
): T => {
  const searchParams = new URLSearch(string)
  const obj: T = {} as T

  searchParams.forEach((value, key) => {
    obj[key] = value
  })

  return obj
}

const createQueryStringFactory = (URLSearch: typeof URLSearchParams) => <T extends {}>(
  obj?: T
): string => {
  if (!obj) return ''
  const filteredObject: Record<string, any> = {}

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) filteredObject[key] = obj[key]
  }

  const searchParams = new URLSearch(filteredObject)
  const searchParamsString = searchParams.toString()

  return searchParamsString.length > 0 ? `?${searchParamsString}` : searchParamsString
}

export const parseQueryString =
  process.env.BUILD_TARGET === 'client'
    ? parseQueryStringFactory(window.URLSearchParams)
    : // eslint-disable-next-line global-require
      parseQueryStringFactory(require('url').URLSearchParams)

export const createQueryString =
  process.env.BUILD_TARGET === 'client'
    ? createQueryStringFactory(window.URLSearchParams)
    : // eslint-disable-next-line global-require
      createQueryStringFactory(require('url').URLSearchParams)
