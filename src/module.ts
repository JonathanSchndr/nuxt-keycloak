import { defineNuxtModule, addPlugin, createResolver, addImportsDir, extendPages, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'
import { WebStorageStateStore } from 'oidc-client-ts'

export interface ModuleOptions {
  /**
   * Authority
   * @default ''
   * @type string
   */
  authority?: string

  /**
   * Client ID
   * @default ''
   * @type string
   */
  clientId?: string

  /**
   * Client Secret
   * @default ''
   * @type string
   */
  clientSecret?: string

  /**
   * Redirect URI
   * @default ''
   * @type string
   */
  redirectUri?: string

  /**
   * Silent redirect URI
   * @default ''
   * @type string
   */
  silentRedirectUri?: string

  /**
   * Post logout redirect URI
   * @default ''
   * @type string
   */
  postLogoutRedirectUri?: string

  /**
   * Response type
   * @default 'code'
   * @type string
   */
  responseType?: string

  /**
   * userStore
   * @default () => new WebStorageStateStore()
   * @type Function
   */
  userStore?: () => NonNullable<unknown>

  /**
   * Load user info
   * @default ''
   * @type boolean
   */
  loadUserInfo?: boolean

  /**
   * Scope
   * @default 'profile email'
   * @type string
   */
  scope?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-keycloak',
    configKey: 'nuxtKeycloak',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    authority: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    silentRedirectUri: '',
    postLogoutRedirectUri: '',
    responseType: 'code',
    userStore: () => new WebStorageStateStore(),
    loadUserInfo: false,
    scope: 'profile email',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    _nuxt.options.runtimeConfig.public = _nuxt.options.runtimeConfig.public || {}
    _nuxt.options.runtimeConfig.public.keycloak = defu(_nuxt.options.runtimeConfig.public.keycloak,
      {
        authority: _options.authority,
        client_id: _options.clientId,
        client_secret: _options.clientSecret,
        redirect_uri: _options.redirectUri,
        silent_redirect_uri: _options.silentRedirectUri,
        post_logout_redirect_uri: _options.postLogoutRedirectUri,
        response_type: _options.responseType,
        userStore: _options.userStore,
        loadUserInfo: _options.loadUserInfo,
        scope: _options.scope,
      },
    )

    addRouteMiddleware({
      name: 'auth',
      path: resolver.resolve('runtime/middleware/auth'),
      global: true,
    })

    extendPages((pages) => {
      pages.unshift({
        name: 'login',
        path: '/auth/login',
        file: resolver.resolve('runtime/pages/auth/login.vue'),
      })
    })

    extendPages((pages) => {
      pages.unshift({
        name: 'logout',
        path: '/auth/logout',
        file: resolver.resolve('runtime/pages/auth/logout.vue'),
      })
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})

declare module '@nuxt/schema' {
  interface ConfigSchema {
    keycloak?: ModuleOptions
    publicRuntimeConfig?: {
      keycloak?: ModuleOptions
    }
  }
}
