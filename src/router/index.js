import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserView from '../views/UserView.vue'
import ProjectHallview from '../views/ProjectHallview.vue'
import ProjectDetailsview from '../views/ProjectDetailsview.vue'
import SmartMatchview from '../views/SmartMatchview.vue'
import Apply from '../views/Apply.vue'
import MyProject from '../views/MyProject.vue'
import GrowthCenter from '../views/GrowthCenter.vue'
import Submitview from '../views/Submitview.vue'
import Evaluationview from '../views/Evaluationview.vue'
import Tracker from '../views/Tracker.vue'
import DataCenter from '../views/DataCenter.vue'
import Messageview from '../views/Messageview.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Help from '../views/Help.vue'
import Privacy from '../views/Privacy.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { 
    path: '/login', 
    component: LoginView,
    meta: { transition: 'slide-right' }
  },
  { 
    path: '/register', 
    component: RegisterView,
    meta: { transition: 'slide-left' }
  },
  { 
    path: '/home', 
    component: HomeView,
    meta: { transition: 'fade' }
  },
  {
    path: '/about',
    component: About,
    meta: { transition: 'fade' }
  },
  {
    path: '/contact',
    component: Contact,
    meta: { transition: 'fade' }
  },
  {
    path: '/help',
    component: Help,
    meta: { transition: 'fade' }
  },
  {
    path: '/privacy',
    component: Privacy,
    meta: { transition: 'fade' }
  },
  { 
    path: '/projects', 
    component: ProjectHallview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/project/:id', 
    component: ProjectDetailsview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/smart-match', 
    component: SmartMatchview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/apply/:projectId', 
    component: Apply,
    meta: { transition: 'fade' }
  },
  { 
    path: '/my-projects', 
    component: MyProject,
    meta: { transition: 'fade' }
  },
  { 
    path: '/growth-center', 
    component: GrowthCenter,
    meta: { transition: 'fade' }
  },
  { 
    path: '/submit/:projectId', 
    component: Submitview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/evaluation/:projectId', 
    component: Evaluationview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/tracker/:projectId', 
    component: Tracker,
    meta: { transition: 'fade' }
  },
  { 
    path: '/statistics', 
    component: DataCenter,
    meta: { transition: 'fade' }
  },
  { 
    path: '/messages', 
    component: Messageview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/user', 
    component: UserView,
    meta: { transition: 'fade' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
