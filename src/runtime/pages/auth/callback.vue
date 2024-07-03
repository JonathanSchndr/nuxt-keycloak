<template></template>

<script lang="ts" setup>
import { useKeycloakAuth, navigateTo, createError } from '#imports'

const auth = useKeycloakAuth()

const signinCallback = async () => {
  try {
    await auth.signinCallback()
    await navigateTo('/')
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to authenticate with OIDC',
    })
  }
}

await signinCallback()
</script>
