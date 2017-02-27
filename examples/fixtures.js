const prompt = require('prompt')
const input = cfg => new Promise(
  (rs, rj) =>
    prompt.get(
      cfg,
      (err, res) => err
        ? rj(err)
        : rs(res)))

const inputField = field =>
  input([{ name: field, required: true }])
    .then(res => res[field])

prompt.start()

module.exports = {
  input,
  inputField
}