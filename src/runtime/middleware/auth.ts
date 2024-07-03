import type { User } from 'oidc-client-ts'
import { useKeycloakAuth, defineNuxtRouteMiddleware } from '#imports'

const authFlowRoutes = ['/auth/login', '/auth/silent-refresh', '/auth/logout']
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useKeycloakAuth()
  const user: User = (await auth.getUser())!

  if ((!user || user.expired) && !authFlowRoutes.includes(to.path)) {
    await auth.signinRedirect()
  }
  else {
    await auth.storeUser(user)
  }
})
