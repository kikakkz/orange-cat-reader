import SplashScreen from '../splash/SplashScreen'
import MainPage from '../main/MainPage'
import BookRack from '../main/BookRack'
import VueRouter from 'vue-router'

const routes = [
    { path: '/', component: SplashScreen },
    { path: '/main', component: MainPage,
      children: [
          { path: '/', component: BookRack }
      ]}
]

const router = new VueRouter({
    routes: routes
})

export default router