import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login/index.vue";
import User from "../views/sys/User/index.vue";
import UserAdd from "../views/sys/User/add.vue";
import File from "../views/Files/index.vue";
import FileUpLoad from "../views/Files/upload.vue";
Vue.use(Router);
//获取原型对象上的push函数
const originalPush = Router.prototype.push;
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/user",
      name: "user",
      component: User,
      children: [
        {
          path: "add",
          name: "addUser",
          component: UserAdd
        }
      ]
    },
    {
      path: "/file",
      name: "file",
      component: File,
      children: [
        {
          path: "/upload",
          name: "upload",
          component: FileUpLoad
        }
      ]
    }
  ]
});
