<script setup lang="ts">
import { ref, reactive } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// État pour les différentes démos
const mailResult = ref<string | null>(null)
const mailLoading = ref(false)
const cacheResult = ref<string | null>(null)
const cacheLoading = ref(false)
const queueResult = ref<string | null>(null)
const queueLoading = ref(false)

const mailForm = reactive({
  to: 'test@example.com',
  subject: 'Test depuis le frontend',
  body: 'Ceci est un email de test envoyé depuis Vue.js !',
})

// Envoyer un email de test
async function sendTestMail() {
  mailLoading.value = true
  mailResult.value = null
  try {
    const response = await fetch(`${apiUrl}/demo/mail/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mailForm),
    })
    const data = await response.json()
    mailResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    mailResult.value = `Erreur: ${error}`
  } finally {
    mailLoading.value = false
  }
}

// Tester le cache
async function testCache() {
  cacheLoading.value = true
  cacheResult.value = null
  try {
    // D'abord on set une valeur
    await fetch(`${apiUrl}/demo/cache/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'test-key', value: `Valeur à ${new Date().toLocaleTimeString()}` }),
    })
    // Puis on la récupère
    const response = await fetch(`${apiUrl}/demo/cache/get/test-key`)
    const data = await response.json()
    cacheResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    cacheResult.value = `Erreur: ${error}`
  } finally {
    cacheLoading.value = false
  }
}

// Tester la queue
async function testQueue() {
  queueLoading.value = true
  queueResult.value = null
  try {
    const response = await fetch(`${apiUrl}/demo/queue/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobName: 'demo-job',
        data: { message: 'Hello depuis la queue !', timestamp: Date.now() }
      }),
    })
    const data = await response.json()
    queueResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    queueResult.value = `Erreur: ${error}`
  } finally {
    queueLoading.value = false
  }
}
</script>

<template>
  <div class="px-4 py-6 sm:px-0 space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Démonstration des services
    </h1>

    <!-- Test Mail -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Test d'envoi de mail
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Les emails sont capturés par Mailpit. Vérifiez-les sur
        <a href="http://localhost:8025" target="_blank" class="text-indigo-600 hover:text-indigo-500">localhost:8025</a>
      </p>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Destinataire</label>
          <input
            v-model="mailForm.to"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sujet</label>
          <input
            v-model="mailForm.subject"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            v-model="mailForm.body"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          ></textarea>
        </div>
        <button
          @click="sendTestMail"
          :disabled="mailLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ mailLoading ? 'Envoi...' : 'Envoyer le mail' }}
        </button>
        <pre v-if="mailResult" class="mt-4 p-4 bg-gray-100 rounded-md text-sm overflow-auto">{{ mailResult }}</pre>
      </div>
    </div>

    <!-- Test Cache -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Test du cache Redis
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Ce test va stocker une valeur dans Redis puis la récupérer.
      </p>
      <button
        @click="testCache"
        :disabled="cacheLoading"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {{ cacheLoading ? 'Test...' : 'Tester le cache' }}
      </button>
      <pre v-if="cacheResult" class="mt-4 p-4 bg-gray-100 rounded-md text-sm overflow-auto">{{ cacheResult }}</pre>
    </div>

    <!-- Test Queue -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Test de la queue (BullMQ)
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Ce test va ajouter un job dans la queue. Le résultat sera logué dans la console du backend.
      </p>
      <button
        @click="testQueue"
        :disabled="queueLoading"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {{ queueLoading ? 'Ajout...' : 'Ajouter un job' }}
      </button>
      <pre v-if="queueResult" class="mt-4 p-4 bg-gray-100 rounded-md text-sm overflow-auto">{{ queueResult }}</pre>
    </div>
  </div>
</template>
