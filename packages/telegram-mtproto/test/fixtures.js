const prompt = require('prompt')

const delayExit = () => setTimeout(() => process.exit(0), 4e3)

const input = cfg => new Promise(
  (rs, rj) =>
    prompt.get(
      cfg,
      (err, res) => err
        ? rj(err)
        : rs(res)))

const inputField/*:(field: string) => Promise<string>*/ = (field/*:string*/)/*:Promise<string>*/ =>
  input([{ name: field, required: true }])
    .then(res => res[field])

prompt.start()

exports.inputField = inputField
exports.delayExit = delayExit
