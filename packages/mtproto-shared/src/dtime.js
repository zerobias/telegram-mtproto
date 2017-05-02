//@flow

const logTimer = (new Date()).getTime()

export const dTimePure = () => ((Date.now()-logTimer) / 1000).toFixed(3)

export const dTime = () => `[${dTimePure()}]`

export default dTime
