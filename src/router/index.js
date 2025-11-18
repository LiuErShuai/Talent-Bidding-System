import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import UserView from '../views/User.vue'
import ProjectHallview from '../views/ProjectHall.vue'
import ProjectDetailsview from '../views/ProjectDetails.vue'
import SmartMatchview from '../views/SmartMatch.vue'
import Apply from '../views/Apply.vue'
import MyProject from '../views/MyProject.vue'
import GrowthCenter from '../views/GrowthCenter.vue'
import Submitview from '../views/Submit.vue'
import Evaluationview from '../views/Evaluation.vue'
import Tracker from '../views/Tracker.vue'
import DataCenter from '../views/DataCenter.vue'
import Messageview from '../views/Message.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Help from '../views/Help.vue'
import Privacy from '../views/Privacy.vue'
import PreReview from '../views/PreReview.vue'
import FinalReview from '../views/FinalReview.vue'
import MidtermDefense from '../views/MidtermDefense.vue'
import ResultsCenter from '../views/ResultsCenter.vue'
import AgreementProcessing from '../views/AgreementProcessing.vue'

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
    path: '/projects/:id', 
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
  { 
    path: '/pre-review', 
    component: PreReview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/final-review', 
    component: FinalReview,
    meta: { transition: 'fade' }
  },
  { 
    path: '/midterm-defense', 
    component: MidtermDefense,
    meta: { transition: 'fade' }
  },
  { 
    path: '/results-center', 
    component: ResultsCenter,
    meta: { transition: 'fade' }
  },
  { 
    path: '/agreement-processing', 
    component: AgreementProcessing,
    meta: { transition: 'fade' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
