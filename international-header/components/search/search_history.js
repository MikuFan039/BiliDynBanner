import { readFromLocal, saveToLocal } from 'g-public/js/utils'

let history = []
let suggestions = []
let maxCount = 10
let syncCallbacks = []

export default {
  init: function (suggestion, config) {
    if (suggestion) {
      suggestions.push(suggestion)
      this.read()
      this.sync()
    }
    this.config = config || {}
    if (this.config.syncCallback) {
      syncCallbacks.push(this.config.syncCallback)
    }
  },
  read: function () {
    if (readFromLocal('search_history') && typeof JSON != 'undefined') {
      history = JSON.parse(readFromLocal('search_history')) || []
      if (!Array.isArray(history)) {
        history = []
      }
    }
    return history
  },
  save: function (value) {
    var item
    if (typeof value == 'object') {
      item = value
    } else {
      item = {
        value,
      }
    }
    if (!(item.value || '').trim()) {
      return
    }
    if (encodeURIComponent(item.value)) {
      var data = {
        value: (item.value || '').trim(),
        isHistory: 1,
        timestamp: Date.parse(new Date()),
      }
      if (item.url) {
        data.url = item.url
      }
      var historyLen = history.length,
        _inArray = false
      for (var i = 0; i < historyLen; i++) {
        if (history[i].value == data.value) {
          history[i] = data
          _inArray = true
          break
        }
      }
      if (!_inArray) {
        if (historyLen < maxCount) {
          history.push(data)
        } else {
          history[historyLen - 1] = data
        }
      }

      history = history.sort(
        function (a, b) {
          if (a.timestamp > b.timestamp) return -1
          if (a.timestamp < b.timestamp) return 1
          return 0
        }
      )
      try {
        saveToLocal('search_history', JSON.stringify(history))
      } catch (e) {

      }
      this.sync()
    }
  },

  remove: function (value) {
    for (var i = 0; i < history.length; i++) {
      if (history[i].value == value) {
        history.splice(i, 1)
        try {
          saveToLocal('search_history', JSON.stringify(history))
        } catch (e) {

        }
        this.sync()
        break
      }
    }
  },

  sync: function () {
    for (var k = 0; k < suggestions.length; k++) {
      var s = suggestions[k].options.defaultSource
      if (s && (s.length != history.length || history.length && s.length && s[0] != history[0])) {
        s.splice(0, s.length)
        for (var j = 0; j < history.length; j++) {
          s.push(history[j])
        }
      }
    }
    for (var i = 0; i < syncCallbacks.length; i++) {
      syncCallbacks[i](history)
    }
  },

  clear: function (callback) {
    history = []
    saveToLocal('search_history', null)
    this.sync()
    if (callback) {
      callback()
    }
  },
};