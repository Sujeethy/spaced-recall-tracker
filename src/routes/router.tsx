import {
  createRouter,
  createRoute,
  createRootRoute,
  createHashHistory,
} from '@tanstack/react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardView } from '../components/dashboard/DashboardView'
import { TodayView } from '../components/today/TodayView'
import { TopicsListView } from '../components/topics/TopicsListView'
import { TopicDetailView } from '../components/topics/TopicDetail/TopicDetailView'
import { CalendarView } from '../components/calendar/CalendarView'
import { LearningLogView } from '../components/log/LearningLogView'
import { StatsView } from '../components/stats/StatsView'
import { SettingsView } from '../components/settings/SettingsView'
import { BackupView } from '../components/backup/BackupView'
import { CoursesListView } from '../components/courses/CoursesListView'
import { CourseDetailView } from '../components/courses/CourseDetail/CourseDetailView'

// 1. Root Route with AppLayout
const rootRoute = createRootRoute({
  component: AppLayout,
})

// 2. Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardView,
})

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/today',
  component: TodayView,
})

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesListView,
})

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailView,
})

const topicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/topics',
  component: TopicsListView,
})

const topicDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/topics/$topicId',
  component: TopicDetailView,
})

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarView,
})

const logRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  component: LearningLogView,
})

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: StatsView,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsView,
})

const backupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/backup',
  component: BackupView,
})

// 3. Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  todayRoute,
  coursesRoute,
  courseDetailRoute,
  topicsRoute,
  topicDetailRoute,
  calendarRoute,
  logRoute,
  statsRoute,
  settingsRoute,
  backupRoute,
])

// 4. Create router
const hashHistory = createHashHistory()

export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent',
})

// Register router for TypeScript types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
