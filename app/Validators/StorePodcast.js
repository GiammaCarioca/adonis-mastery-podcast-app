'use strict'

class StorePodcast {
  get validateAll() {
    return true
  }

  get rules () {
    return {
      title: 'required',
      category_id: 'required',
      description: 'required'
    }
  }
}

module.exports = StorePodcast
