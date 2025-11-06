<template>
  <div class="calendar-month-view">
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
      <div
        v-for="day in weekdays"
        :key="day"
        class="bg-white dark:bg-gray-900 px-2 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 flex-1">
      <div
        v-for="day in days"
        :key="day.toISOString()"
        class="bg-white dark:bg-gray-900 min-h-[120px] p-2 relative"
        :class="{
          'bg-gray-50 dark:bg-gray-800': !isCurrentMonth(day),
          'ring-2 ring-primary-500': isToday(day)
        }"
      >
        <!-- Day number -->
        <div
          class="text-sm font-medium mb-1"
          :class="{
            'text-gray-400 dark:text-gray-600': !isCurrentMonth(day),
            'text-primary-600 dark:text-primary-400': isToday(day),
            'text-gray-900 dark:text-gray-100': isCurrentMonth(day) && !isToday(day)
          }"
        >
          {{ day.getDate() }}
        </div>

        <!-- Events for this day -->
        <div class="space-y-1">
          <div
            v-for="event in getDayEvents(day)"
            :key="event.id"
            class="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            :class="getEventColorClass(event.color)"
            :title="`${event.title} - ${formatTime(event.start)} to ${formatTime(event.end)}`"
          >
            {{ formatTime(event.start) }} {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentDate: Date
  events: any[]
}>()

const weekdays = ['日', '月', '火', '水', '木', '金', '土']

const days = computed(() => getMonthDays(props.currentDate))

const isCurrentMonth = (day: Date) => {
  return day.getMonth() === props.currentDate.getMonth()
}

const isToday = (day: Date) => {
  const today = new Date()
  return isSameDay(day, today)
}

const getDayEvents = (day: Date) => {
  return getEventsForDay(props.events, day)
}

const getEventColorClass = (color?: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
  return colors[color || 'blue'] || colors.blue
}
</script>

<style scoped>
.calendar-month-view {
  @apply flex flex-col h-full;
}
</style>
