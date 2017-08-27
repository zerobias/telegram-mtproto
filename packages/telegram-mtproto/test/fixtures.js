
//$off
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

const getStorageData = (id/*:: : number*/) => ({
  nearest_dc: id,
  dc        : id,
})

// prompt.start()

const delay = (time/*:: : number*/) => new Promise(rs => setTimeout(rs, time))

const consoleHR = (text) => console.log(`----------------------${text}----------------------`)

function infoMessage(str) {
  const value = `
--- INFO ---

  ${str}

--- --- ---
`
  console.log(value)
}

function infoCallMethod(str) {
  infoMessage(`Call method ${str}`)
}


exports.getStorageData = getStorageData
exports.inputField = inputField
exports.delayExit = delayExit
exports.delay = delay
exports.consoleHR = consoleHR
exports.infoCallMethod = infoCallMethod
