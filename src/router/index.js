import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

import DefaultLayout from '../views/Layout/DefaultLayout.vue'
import AuthLayout from '../views/Layout/AuthLayout.vue'
import CMSLayout from '../views/Layout/CMSLayout.vue'
import UserSettingsLayout from '../views/Layout/UserSettingsLayout.vue'
import PortfolioSettingsLayout from '../views/Layout/PortfolioSettingsLayout.vue'
import PublicPortfolio from '../views/Layout/PublicPortfolioLayout.vue'

// Auth
import Register from '../views/Auth/AuthSignUp.vue'
import Login from '../views/Auth/AuthSignIn.vue'
import EmailVerify from '../views/Auth/AuthEmailVerify.vue'
import ForgotPassword from '../views/Auth/AuthForgotPassword.vue'
import ResetPassword from '../views/Auth/AuthResetPassword.vue'

// Settings
import AccountSettings from '../views/Settings/UserSettingsAccount.vue'
import ProfileSettings from '../views/Settings/UserSettingsProfile.vue'
import PasswordSettings from '../views/Settings/UserSettingsPassword.vue'
import AccountDelete from '../views/Settings/UserSettingsDeleteAccount.vue'


// Restore account
import AccountRestore from '../views/RestoreAccount.vue'


// Gestione Portfolio
import CMSHome from '../views/CMS/CMSHome.vue'
import PortfolioCreate from '../views/CMS/PortfolioCreate.vue'
import PortfolioRestore from '../views/CMS/PortfolioRestore.vue'

// About me

import AboutMeEdit from '../views/CMS/AboutMe/AboutMeEdit.vue'


//Gallerie
import GalleriesView from '../views/CMS/Gallery/GalleriesView.vue'
import GalleriesDeletedView from '../views/CMS/Gallery/GalleriesDeletedView.vue'
import GalleryEdit from '../views/CMS/Gallery/GalleryEdit.vue'
import GalleryAdd from '../views/CMS/Gallery/GalleryAdd.vue'
import GalleryView from '../views/CMS/Gallery/GalleryView.vue'

// Posts
import PostAdd from '../views/CMS/Posts/PostAdd.vue'
import PostEdit from '../views/CMS/Posts/PostEdit.vue'

// Settings
import PortfolioSettings from '../views/Settings/PortfolioSettings.vue'
import PortfolioArchiveSettings from '../views/Settings/PortfolioArchiveSettings.vue'
import DeletePortfolio from '../views/Settings/PortfolioDeleteSettings.vue'

// Portfolio
//import PublicPortfolio from '../views/Portfolio/PublicPortfolioLayout.vue'
import PublicPortfolioSection from '../views/Portfolio/PublicPortfolioSection.vue'

import NotFound from '../views/NotFound.vue'

const APP_NAME = 'atArtist'

const routes = [
  {
    path: '/',
    name: 'home',
    component: DefaultLayout,
    children: [
      {
        path: 'auth/email-verify',
        name: 'email-verify',
        component: EmailVerify,
        meta: {
          title: 'Verify your email | ' + APP_NAME,
          auth: true
        }
      },
      {
        path: 'settings',
        component: UserSettingsLayout,
        meta: {
          title: 'Settings | ' + APP_NAME,
          auth: true,
          base: 'settings'
        },
        children: [
          {
            path: '',
            name: 'settings-user-account',
            meta: {
              auth: true,
              active: 'account'
            },
            component: AccountSettings
          },
          {
            path: 'profile',
            name: 'settings-user-profile',
            meta: {
              auth: true,
              active: 'profile'
            },
            component: ProfileSettings
          },
          {
            path: 'password',
            name: 'settings-user-password',
            meta: {
              auth: true,
              active: 'password'
            },
            component: PasswordSettings
          },
          {
            path: 'delete-account',
            name: 'settings-user-delete-account',
            meta: {
              auth: true,
              active: 'delete-account'
            },
            component: AccountDelete
          }
        ]
      },
      {
        path: 'auth/restore-account',
        name: 'restore-account',
        component: AccountRestore,
        meta: {
          title: 'Restore your account | ' + APP_NAME,
          auth: true
        }
      },
      {
        path: '/portfolio',
        component: CMSLayout,
        meta: {
          auth: true,
          base: 'portfolio'
        },
        children: [
          {
            path: '',
            name: 'home-cms',
            meta: {
              title: 'Home | ' + APP_NAME,
              auth: true,
            },
            component: CMSHome
          },
          {
            path: 'restore',
            name: 'portfolio-restore',
            meta: {
              title: 'Restore your portfolio | ' + APP_NAME,
              auth: true,
            },
            component: PortfolioRestore
          },
          {
            path: 'about-me',
            name: 'about-me-view',
            meta: {
              title: 'about me | ' + APP_NAME,
              auth: true,
            },
            component: AboutMeEdit
          },
          {
            path: 'new-gallery',
            name: 'galleries-add',
            meta: {
              title: 'Add new gallery | ' + APP_NAME,
              auth: true,
            },
            component: GalleryAdd
          },
          {
            path: 'galleries',
            name: 'galleries-all',
            meta: {
              title: 'Galleries | ' + APP_NAME,
              auth: true,
            },
            component: GalleriesView
          },
          {
            path: 'deleted-galleries',
            name: 'galleries-deleted',
            meta: {
              title: 'Deleted Galleries | ' + APP_NAME,
              auth: true,
            },
            component: GalleriesDeletedView
          },
          {
            path: 'galleries/:slug',
            name: 'galleries-view',
            meta: {
              title: 'View gallery | ' + APP_NAME,
              auth: true,
            },
            component: GalleryView
          },
          {
            path: 'galleries/:slug/edit',
            name: 'galleries-edit',
            meta: {
              title: 'Edit gallery | ' + APP_NAME,
              auth: true,
            },
            component: GalleryEdit
          },
          {
            path: 'galleries/:slug/new-post',
            name: 'galleries-post-add',
            meta: {
              title: 'Add post to gallery | ' + APP_NAME,
              auth: true,
            },
            component: PostAdd
          },
          {
            path: 'galleries/:slug/:post',
            name: 'galleries-post-edit',
            meta: {
              title: 'Edit post | ' + APP_NAME,
              auth: true,
            },
            component: PostEdit
          },
          {
            path: 'settings',
            meta: {
              title: 'Portfolio settings | ' + APP_NAME,
              auth: true,
            },
            component: PortfolioSettingsLayout,
            children: [
              {
                path: '',
                name: 'settings-portfolio',
                meta: {
                  auth: true,
                  active: 'portfolio'
                },
                component: PortfolioSettings
              },
              {
                path: 'portfolio-archive',
                name: 'settings-portfolio-archive',
                meta: {
                  auth: true,
                  active: 'archive'
                },
                component: PortfolioArchiveSettings
              },
              {
                path: 'delete-account',
                name: 'settings-portfolio-delete',
                meta: {
                  auth: true,
                  active: 'delete-portfolio'
                },
                component: DeletePortfolio
              }
            ]
          },
        ]
      },
      {
        path: 'portfolio/new',
        name: 'portfolio-create',
        meta: {
          title: 'Open your portfolio | ' + APP_NAME,
          auth: true,
          base: 'portfolio'
        },
        component: PortfolioCreate
      },
      {
        path: ':name',
        name: 'public-portfolio',
        component: PublicPortfolio,
        children: [
          {
            path: '',
            name: 'public-portfolio-home',
            component: PublicPortfolioSection
          },
          {
            path: ':slug',
            name: 'public-portfolio-section',
            component: PublicPortfolioSection
          },
        ]
      },
    ]
  },
  {
    path: '/auth',
    redirect: 'auth/sign-up',
    meta: {
      guestOnly: true,
    },
    component: AuthLayout,
    children: [
      {
        path: 'sign-up',
        name: 'sign-up',
        component: Register,
        meta: {
          title: 'Sign up | ' + APP_NAME,
        }
      },
      {
        path: 'sign-in',
        name: 'sign-in',
        component: Login,
        meta: {
          title: 'Sign in | ' + APP_NAME,
        }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
          title: 'Forgot-password | ' + APP_NAME,
        }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: 'Reset-password | ' + APP_NAME,
        }
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    meta: {
      title: 'Page not found | ' + APP_NAME,
    },
    component: DefaultLayout,
    children: [
      {
        path: '/not-found',
        name: 'not-found',
        component: NotFound,
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  document.title = to.meta.title || APP_NAME

  if (store.setToken() && (to.meta.guestOnly)) {
    document.title = APP_NAME
    return next({ name: 'home' })
  }

  if (to.meta.auth && store.setToken() == '') {
    document.title = 'Sign up | ' + APP_NAME
    return next({ name: 'sign-in' })
  }

  if (store.getUser.status != null && to.name != 'restore-account') {
    document.title = 'Restore your account | ' + APP_NAME
    return next({ name: 'restore-account' })
  }

  return next();
})



export default router