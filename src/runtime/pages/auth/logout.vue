<template></template>

<script lang="ts" setup>
import { useKeycloakAuth, createError } from '#imports'

const auth = useKeycloakAuth()

const signoutRedirect = async () => {
  try {
    await auth.clearStaleState()
    await auth.signoutRedirect()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to log out with OIDC',
    })
  }
}

await signoutRedirect()
</script>
