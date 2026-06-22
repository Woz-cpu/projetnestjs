<script setup lang="ts">
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Bienvenue sur le projet de base
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Stack : NestJS + Vue 3 + PostgreSQL + Redis + Mailpit
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <!-- Card Backend -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="text-indigo-600 text-3xl mb-3">API</div>
            <h3 class="text-lg font-medium text-gray-900">Backend NestJS</h3>
            <p class="mt-2 text-sm text-gray-500">
              API REST avec Prisma ORM, validation, et modules de démonstration.
            </p>
            <a
              href="http://localhost:3000"
              target="_blank"
              class="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              localhost:3000 &rarr;
            </a>
          </div>
        </div>

        <!-- Card Mail -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="text-green-600 text-3xl mb-3">Mail</div>
            <h3 class="text-lg font-medium text-gray-900">Mailpit</h3>
            <p class="mt-2 text-sm text-gray-500">
              Serveur mail local pour tester l'envoi d'emails.
            </p>
            <a
              href="http://localhost:8025"
              target="_blank"
              class="mt-4 inline-block text-green-600 hover:text-green-500"
            >
              localhost:8025 &rarr;
            </a>
          </div>
        </div>

        <!-- Card Redis -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="text-red-600 text-3xl mb-3">Cache</div>
            <h3 class="text-lg font-medium text-gray-900">Redis</h3>
            <p class="mt-2 text-sm text-gray-500">
              Cache et système de queues pour les tâches asynchrones.
            </p>
            <p class="mt-4 text-sm text-gray-400">
              Port : 6379
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
