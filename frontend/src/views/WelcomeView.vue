<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const lastName = route.query.lastName as string | undefined

if (!lastName) {
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1>Bienvenue, {{ lastName }}</h1>
  </div>
</template>
