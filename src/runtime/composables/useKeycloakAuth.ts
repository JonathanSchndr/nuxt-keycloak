import {
  type UserManagerSettings,
  UserManager,
  WebStorageStateStore,
} from 'oidc-client-ts'
import { useRuntimeConfig } from '#imports'

export const useKeycloakAuth = () => {
  const settings: UserManagerSettings = {
    authority: `${useRuntimeConfig().oidcProvidersKeycloakBaseUrl}`,
    client_id: `${useRuntimeConfig().oidcProvidersKeycloakClientId}`,
    client_secret: `${useRuntimeConfig().oidcProvidersKeycloakClientSecret}`,
    redirect_uri: `${useRuntimeConfig().portalUrl}/auth`,
    silent_redirect_uri: `${useRuntimeConfig().portalUrl}/silent-refresh`,
    post_logout_redirect_uri: `${useRuntimeConfig().portalUrl}`,
    response_type: 'code',
    userStore: new WebStorageStateStore(),
    loadUserInfo: false,
    scope: 'profile email',
  }

  return new UserManager(settings)
}
