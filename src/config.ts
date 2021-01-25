const dataSource = process.env.BUILD_TARGET === 'client' ? window.env : process.env

export const config = {
  BACKEND_URL: dataSource.BACKEND_URL,
  TOKEN_KEY: 'token',
}
