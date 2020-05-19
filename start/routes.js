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

Route.get("/", "TestController.index").as('home');

Route.get("register", "Auth/RegisterController.showRegister");
Route.post("register", "Auth/RegisterController.register").as('register');
Route.post("logout", "Auth/LogoutController.logout").as('logout');
Route.get("login", "Auth/LoginController.showLogin");
Route.post("login", "Auth/LoginController.login").as('login');
