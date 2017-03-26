//@flow

const logTimer = (new Date()).getTime()

export const dTime = () => `[${(((new Date()).getTime() -logTimer) / 1000).toFixed(3)}]`

export default dTime