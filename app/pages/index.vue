<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="h-screen flex flex-col">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Left section: Title and navigation -->
          <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">カレンダー</h1>
            
            <div class="flex items-center gap-2">
              <UButton
                color="gray"
                variant="ghost"
                @click="goToPreviousPeriod"
                aria-label="前の期間"
              >
                ←
              </UButton>
              <UButton
                color="gray"
                variant="ghost"
                @click="goToToday"
              >
                今日
              </UButton>
              <UButton
                color="gray"
                variant="ghost"
                @click="goToNextPeriod"
                aria-label="次の期間"
              >
                →
              </UButton>
            </div>

            <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ currentPeriodLabel }}
            </div>
          </div>

          <!-- Right section: View switcher -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <UButton
                :color="view === 'month' ? 'primary' : 'gray'"
                :variant="view === 'month' ? 'solid' : 'ghost'"
                @click="toggleView('month')"
              >
                月
              </UButton>
              <UButton
                :color="view === 'week' ? 'primary' : 'gray'"
                :variant="view === 'week' ? 'solid' : 'ghost'"
                @click="toggleView('week')"
              >
                週
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar view -->
      <div class="flex-1 overflow-hidden p-4">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full overflow-hidden">
          <CalendarMonthView
            v-if="view === 'month'"
            :current-date="currentDate"
            :events="events"
          />
          <CalendarWeekView
            v-else
            :current-date="currentDate"
            :events="events"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  currentDate,
  view,
  events,
  goToToday,
  goToPreviousPeriod,
  goToNextPeriod,
  toggleView
} = useCalendar()

const currentPeriodLabel = computed(() => {
  if (view.value === 'month') {
    return formatMonthYear(currentDate.value)
  } else {
    const weekDays = getWeekDays(currentDate.value)
    return formatWeekRange(weekDays[0])
  }
})

useHead({
  title: 'Googleカレンダー風 - Nuxt UI',
  meta: [
    { name: 'description', content: 'Nuxt 4 と Nuxt UI 4 で実装したGoogleカレンダー風のアプリケーション' }
  ]
})
</script>
