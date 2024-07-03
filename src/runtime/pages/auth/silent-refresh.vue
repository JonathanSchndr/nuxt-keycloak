<template></template>

<script lang="ts" setup>
import { useKeycloakAuth, createError } from '#imports'

const auth = useKeycloakAuth()

const signinSilentCallback = async () => {
  try {
    await auth.signinSilentCallback()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to silently refresh OIDC token',
    })
  }
}

await signinSilentCallback()
</script>
