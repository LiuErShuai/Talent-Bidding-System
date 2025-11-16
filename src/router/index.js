import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserView from '../views/UserView.vue'

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
    path: '/user', 
    component: UserView,
    meta: { transition: 'fade' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   const whiteList = ['/login', '/register']
//   if (!whiteList.includes(to.path) && !token) {
//     next('/login')
//   } else {
//     next()
//   }
// })
export default router
