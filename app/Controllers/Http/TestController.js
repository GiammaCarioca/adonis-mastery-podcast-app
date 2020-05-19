"use strict";

// const User = use("App/Models/User")

// class TestController {
//   async index({ view }) {
//     const users = await User.all()

//     return view.render("welcome", { users: users.toJSON() })
//   }
// }

class TestController {
  index({ view }) {
    return view.render("welcome")
  }
}

module.exports = TestController;
