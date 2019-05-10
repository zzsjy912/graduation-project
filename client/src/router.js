import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/consumer/Index.vue'
import { Loading,Message} from 'element-ui';
import store from './store'
import axios from "./http";

Vue.prototype.$axios = axios;
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home',
      meta: {
        title: '首页'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: () => import('./views/consumer/home.vue'),
        },
        {
          path: '/movieinfo/:id',
          name: 'movieinfo',
          component: () => import('./views/consumer/movieinfo.vue'),

        },
        {
          path: '/article/:id',
          name: 'article',
          component: () => import('./views/consumer/articleDetails.vue'),
        },
        {
          path: '/my',
          name: 'My',
          component: () => import('./views/consumer/My.vue'),
          children: [
            {
              path: '/my/all',
              name: 'MyAll',
              component: () => import('./views/consumer/user/user_all.vue'),
              meta: {
                title: '我的动态',
                noLoading: true
              }
            },
            {
              path: '/my/paragraph',
              name: 'MyParagraph',
              component: () => import('./views/consumer/user/user_paragraph.vue'),
              meta: {
                title: '我的评论',
                noLoading: true
              }
            },
            {
              path: '/my/article',
              name: 'MyArticle',
              component: () => import('./views/consumer/user/user_article.vue'),
              meta: {
                title: '我的影评',
                noLoading: true
              }
            },
            {
              path: '/my/reply',
              name: 'MyReply',
              component: () => import('./views/consumer/user/user_reply.vue'),
              meta: {
                title: '我的回复',
                noLoading: true
              }
            },
            {
              path: '/my/message',
              name: 'MyMessage',
              component: () => import('./views/consumer/user/user_message.vue'),
              meta: {
                title: '我的消息',
                noLoading: true
              }
            },
          ]
        },
        {
          path: '/people/:user',
          name: 'People',
          component: () => import('./views/consumer/People.vue'),
          children: [
            {
              path: '/people/:user/all',
              name: 'PeopleAll',
              component: () => import('./views/consumer/people/people_all.vue'),
              meta: {
                noLoading: true
              }
            },
            {
              path: '/people/:user/paragraph',
              name: 'PeopleParagraph',
              component: () => import('./views/consumer/people/people_paragraph.vue'),
              meta: {
                noLoading: true
              }
            },
            {
              path: '/people/:user/article',
              name: 'PeopleArticle',
              component: () => import('./views/consumer/people/people_article.vue'),
              meta: {
                noLoading: true
              }
            },
            {
              path: '/people/:user/reply',
              name: 'PeopleReply',
              component: () => import('./views/consumer/people/people_reply.vue'),
              meta: {
                noLoading: true
              }
            },
          ]
        },
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/home',
      meta: {
        title: '后台管理'
      },
      component: () => import('./views/admin/adminIndex.vue'),
      children: [
        {
          path: '/admin/home',
          name: 'adminHome',
          meta: {
            noLoading: true
          },
          component: () => import('./views/admin/adminHome.vue'),
        },
        {
          path: '/admin/notice',
          name: 'adminNotice',
          meta: {
            noLoading: true
          },
          component: () => import('./views/admin/adminNotice.vue'),
        },
        {
          path: '/admin/movie',
          name: 'adminMovie',
          meta: {
            noLoading: true
          },
          component: () => import('./views/admin/adminMovie.vue'),
        },
        {
          path: '/admin/userinfo',
          name: 'adminUserinfo',
          meta: {
            noLoading: true
          },
          component: () => import('./views/admin/adminUserInfo.vue'),
        },
        {
          path: '/admin/article',
          name: 'adminArticle',
          meta: {
            noLoading: true
          },
          component: () => import('./views/admin/adminArticle.vue'),
        }
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/consumer/Register.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/consumer/Login.vue'),
      meta: {
        title: '登陆'
      }
    },
    {
      path: '*',
      name: 'Notfound',
      component: () => import('./views/consumer/404.vue'),
      meta: {
        title: '404'
      }
    }
  ]
});


// 路由守卫

var loading;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0,0,0,0,7)'
  });
}
function endLoading() {
  loading.close()
}

function setTitle(to) {
  if (to.meta.title) {
    document.title = to.meta.title
  }
}

function getMessageInfo() {
  axios.post('/api/message/dropdown')
    .then(res => {
      console.log(res.data);
      store.commit("setMessageInfo", res.data);
    })
}
function isAdmin() {
  var identity =
    store.state.Userinfo.identity ? store.state.Userinfo.identity :
      JSON.parse(localStorage.getItem("setUserinfo")).identity;
  if (identity == 0) {
    Message({
        message: "无权限",
        type: "error"
      });
      return true
    } else 
    return false
}
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.Token ? true : false;
  document.body.scrollTop = 0

  if (!to.meta.noLoading) {
    startLoading()
  }
  if (to.path.indexOf('admin' )!= -1) {
    if (isAdmin()) {
      next('/home')
    } else
      next()
  } else
    if (to.path == '/login' || to.path == '/register') {
      next();
      endLoading()
    } else {
      if (isLogin) {
        getMessageInfo()
        setTitle(to);
        next()
        if (!to.meta.noLoading) {
          endLoading()
        }
      } else {
        next('/login')
        endLoading()
      }

    }
})

export default router;
