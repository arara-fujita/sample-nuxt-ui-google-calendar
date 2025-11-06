<template>
  <div class="calendar-week-view">
    <!-- Header with day names and dates -->
    <div class="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
      <!-- Time column header -->
      <div class="bg-white dark:bg-gray-900 p-2"></div>
      
      <!-- Day headers -->
      <div
        v-for="day in days"
        :key="day.toISOString()"
        class="bg-white dark:bg-gray-900 p-2 text-center"
        :class="{ 'bg-primary-50 dark:bg-primary-900': isToday(day) }"
      >
        <div class="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {{ formatDayName(day) }}
        </div>
        <div
          class="text-lg font-bold mt-1"
          :class="{
            'text-primary-600 dark:text-primary-400': isToday(day),
            'text-gray-900 dark:text-gray-100': !isToday(day)
          }"
        >
          {{ day.getDate() }}
        </div>
      </div>
    </div>

    <!-- Time grid -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700">
        <!-- Time labels column -->
        <div class="bg-white dark:bg-gray-900">
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-16 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 pr-2 pt-1 text-right"
          >
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Day columns -->
        <div
          v-for="day in days"
          :key="day.toISOString()"
          class="bg-white dark:bg-gray-900 relative"
          :class="{ 'bg-primary-50/30 dark:bg-primary-900/30': isToday(day) }"
        >
          <!-- Hour divisions -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-16 border-t border-gray-200 dark:border-gray-700"
          ></div>

          <!-- Events for this day -->
          <div
            v-for="event in getDayEvents(day)"
            :key="event.id"
            class="absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
            :class="getEventColorClass(event.color)"
            :style="getEventStyle(event)"
            :title="`${event.title}\n${formatTime(event.start)} - ${formatTime(event.end)}\n${event.description || ''}`"
          >
            <div class="font-semibold truncate">{{ event.title }}</div>
            <div class="text-xs opacity-90 truncate">
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
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

const days = computed(() => getWeekDays(props.currentDate))

const hours = Array.from({ length: 24 }, (_, i) => i)

const isToday = (day: Date) => {
  const today = new Date()
  return isSameDay(day, today)
}

const formatDayName = (day: Date) => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return weekdays[day.getDay()]
}

const formatHour = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const getDayEvents = (day: Date) => {
  return getEventsForDay(props.events, day)
}

const getEventStyle = (event: any) => {
  const start = new Date(event.start)
  const end = new Date(event.end)
  
  const startHour = start.getHours()
  const startMinute = start.getMinutes()
  const endHour = end.getHours()
  const endMinute = end.getMinutes()
  
  const top = (startHour + startMinute / 60) * 64 // 64px per hour (h-16)
  const duration = ((endHour + endMinute / 60) - (startHour + startMinute / 60))
  const height = duration * 64
  
  return {
    top: `${top}px`,
    height: `${Math.max(height, 32)}px` // Minimum height
  }
}

const getEventColorClass = (color?: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-500',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-l-4 border-green-500',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-l-4 border-purple-500',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-l-4 border-orange-500',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-l-4 border-red-500'
  }
  return colors[color || 'blue'] || colors.blue
}
</script>

<style scoped>
.calendar-week-view {
  @apply flex flex-col h-full;
}
</style>
