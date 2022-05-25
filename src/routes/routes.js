import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import AuthLayout from "@/views/Pages/AuthLayout.vue";

import NotFound from "@/views/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    redirect: "home",
    component: DashboardLayout,
    children: [
      {
        path: "/home",
        name: "home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/HomeView.vue")
      },
      {
        path: "/board",
        name: "board",
        component: () =>
          import(
            /* webpackChunkName: "demo" */ "../views/RegularNoticeTables.vue"
          )
      },
      {
        path: "/qna",
        name: "qna",
        component: () =>
          import(/* webpackChunkName: "demo" */ "@/views/RegularQnaTables.vue"),
        redirect: "/qna/list",
        children: [
          {
            path: "list",
            name: "qnaList",
            component: () =>
              import(
                /* webpackChunkName: "demo" */ "@/views/Tables/RegularTables/LightQnaTable.vue"
              )
          },
          {
            path: "boardDetail",
            name: "boardDetail",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "demo" */ "@/views/Pages/Board/QnaDetail.vue"
              )
          },
          {
            path: "boardDelete",
            name: "boardDelete",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "demo" */ "@/views/Pages/Board/QnaDelete.vue"
              )
          },
          {
            path: "boardModify",
            name: "boardModify",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "demo" */ "@/views/Pages/Board/QnaModify.vue"
              )
          },
          {
            path: "boardRegister",
            name: "boardRegister",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "demo" */ "@/views/Pages/Board/QnaRegister.vue"
              )
          }
        ]
      },
      {
        path: "/news",
        name: "news",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/NewsView.vue")
      },
      {
        path: "/profile",
        name: "profile",
        component: () =>
          import(
            /* webpackChunkName: "demo" */ "../views/Pages/UserProfile.vue"
          )
      },
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/Login.vue")
      },
      {
        path: "/logout",
        name: "logout",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/Logout.vue")
      },
      {
        path: "/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/Register.vue")
      }
    ]
  }
];

export default routes;
