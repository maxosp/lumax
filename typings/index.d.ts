declare module '*.svg' {
  const content: string
  export default content
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined
    RAZZLE_ASSETS_MANIFEST: string
    RAZZLE_PUBLIC_DIR: string
    BUILD_TARGET: 'client' | 'server'
  }
  interface Process extends EventEmitter {
    env: ProcessEnv
  }
}

declare interface NodeModule {
  hot: {
    accept(path?: string, cb?: () => void): void
  }
}

declare interface Window {
  env: {
    [key: string]: string
  }
}

declare module 'vuetable-2'

declare module 'vue-awesome-swiper'

// declare module 'ckeditor'
