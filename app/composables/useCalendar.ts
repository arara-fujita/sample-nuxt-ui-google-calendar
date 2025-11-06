export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color?: string
  description?: string
}

export type CalendarView = 'month' | 'week'

export function useCalendar() {
  const currentDate = ref(new Date())
  const view = ref<CalendarView>('month')
  const events = ref<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(2025, 10, 6, 10, 0),
      end: new Date(2025, 10, 6, 11, 0),
      color: 'blue',
      description: 'Weekly team sync'
    },
    {
      id: '2',
      title: 'Project Review',
      start: new Date(2025, 10, 7, 14, 0),
      end: new Date(2025, 10, 7, 15, 30),
      color: 'green',
      description: 'Q4 project review'
    },
    {
      id: '3',
      title: 'Client Call',
      start: new Date(2025, 10, 8, 9, 0),
      end: new Date(2025, 10, 8, 10, 0),
      color: 'purple',
      description: 'Client check-in'
    },
    {
      id: '4',
      title: 'Workshop',
      start: new Date(2025, 10, 10, 13, 0),
      end: new Date(2025, 10, 10, 17, 0),
      color: 'orange',
      description: 'Design workshop'
    }
  ])

  const goToToday = () => {
    currentDate.value = new Date()
  }

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate.value)
    if (view.value === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    currentDate.value = newDate
  }

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate.value)
    if (view.value === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    currentDate.value = newDate
  }

  const toggleView = (newView: CalendarView) => {
    view.value = newView
  }

  return {
    currentDate,
    view,
    events,
    goToToday,
    goToPreviousPeriod,
    goToNextPeriod,
    toggleView
  }
}

export function getMonthDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))
  
  const days: Date[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

export function getWeekDays(date: Date) {
  const days: Date[] = []
  const startOfWeek = new Date(date)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(day.getDate() + i)
    days.push(day)
  }
  
  return days
}

export function isSameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

export function getEventsForDay(events: CalendarEvent[], day: Date) {
  return events.filter(event => {
    const eventStartDay = new Date(event.start)
    eventStartDay.setHours(0, 0, 0, 0)
    const eventEndDay = new Date(event.end)
    eventEndDay.setHours(0, 0, 0, 0)
    const checkDay = new Date(day)
    checkDay.setHours(0, 0, 0, 0)
    
    return checkDay >= eventStartDay && checkDay <= eventEndDay
  })
}

export function formatMonthYear(date: Date) {
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
}

export function formatWeekRange(startDate: Date) {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  
  return `${startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}
