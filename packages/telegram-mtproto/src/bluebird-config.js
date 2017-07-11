//@flow

import Bluebird from 'bluebird'

//$FlowIssue
Bluebird.config({
  warnings: {
    wForgottenReturn: false
  },
  longStackTraces: true,
  cancellation   : true,
  monitoring     : false
})
