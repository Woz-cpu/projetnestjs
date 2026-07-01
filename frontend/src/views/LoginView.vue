<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await response.json()
    if (!response.ok) {
      error.value = data.message
      return
    }
    router.push({ name: 'welcome', query: { lastName: data.lastName } })
  } catch {
    error.value = 'erreur : identifiants incorrects'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="flex flex-col gap-2">
      <input v-model="username" type="text" placeholder="Nom" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <button type="submit">Se connecter</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>
