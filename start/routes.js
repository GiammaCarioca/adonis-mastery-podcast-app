"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", "HomeController.index").as('home');

Route.get("register", "Auth/RegisterController.showRegister");
Route.post("register", "Auth/RegisterController.register").as('register');
Route.post("logout", "Auth/LogoutController.logout").as('logout');
Route.get("login", "Auth/LoginController.showLogin");
Route.post("login", "Auth/LoginController.login").as('login');
Route.get("password/reset", "Auth/PasswordResetController.showLinkRequestForm");
Route.post("password/email", "Auth/PasswordResetController.sendResetLinkEmail");
Route.get("password/reset/:token", "Auth/PasswordResetController.showResetForm");
Route.post("password/reset", "Auth/PasswordResetController.reset");
Route.group(() => {
  Route.get('/account', 'UserController.showEditAccount').as('settings.account')
  Route.put('/account', 'UserController.updateAccount')
  Route.get('/password', 'UserController.showChangePassword').as('settings.password')
  Route.put('/password', 'UserController.updatePassword')
}).prefix('/settings')
Route.resource('podcasts', 'PodcastController')
  .except(['index', 'show'])
  .validator(new Map([[['podcasts.store'], ['StorePodcast']]]))
Route.get('my-podcast', 'UserController.myPodcast').as('myPodcast')
