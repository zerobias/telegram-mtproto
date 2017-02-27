const test = require('tap').test
const Nightmare = require('nightmare')

const night = Nightmare({
  openDevTools: {
    mode: 'detach'
  },
  show            : true,
  executionTimeout: 120e3
})

const data = {
  phoneCode: '+9',
  phone    : '996620000',
  code     : '22222',

  url : 'http://localhost:8000/',
  sel1: {
    country: '[ng-model="credentials.phone_country"]',
    phone  : '[ng-model="credentials.phone_number"]',
    code   : '[ng-model="credentials.phone_code"]',
    next   : '.login_head_submit_btn',
    ok     : '[ng-click="$close()"]',
    form   : '.login_page',
    end    : '[my-i18n="im_select_a_chat"]',
    err    : '[my-i18n="error_modal_internal_title"]',
    im     : 'Please select a chat to start messaging'
  }
}

const fieldFastEdit = function(sel) {
  document.querySelector(sel).value = ''
  return document.querySelector(sel).value
}
test('try login', t => {
  t.notThrow(async () => {
    let count = 0,
        done = false
    await night
      .goto(data.url)
    while (count < 5 && !done) {
      const isError = await night
        .wait(data.sel1.country)
        .wait(8e3)
        .visible(data.sel1.err)
      console.log('succ', isError)
      done = !isError
      if (isError)
        await night
          .refresh()
      count++
    }
    await night
    //   .goto(data.url)
    //   .wait(data.sel1.country)
    //   .wait(8e3)
    //   // .click(data.sel1.country)
      .evaluate(fieldFastEdit, data.sel1.country)
      .insert(
        data.sel1.country,
        data.phoneCode)
      .insert(
        data.sel1.phone,
        data.phone)
      .click(data.sel1.next)
      .wait(data.sel1.ok)
      .wait(2e3)
      .click(data.sel1.ok)
      .wait(data.sel1.code)
      .wait(2e3)
      .type(data.sel1.code, data.code)
      .wait(data.sel1.end)
      .wait(9e3)
    const text = await night
      .evaluate(function(sel){
        return document.querySelector(sel).innerText
      }, data.sel1.end)
    if (text === data.sel1.im)
      await night.end()
      // .retype(data.sel1.country, '+9')
      // .then(e => {
    console.warn('done', text)

    t.equal(text, data.sel1.im, 'valid welcome message')
    t.end()
    // process.exit(0)
      // })
  }, 'smoke test')
})