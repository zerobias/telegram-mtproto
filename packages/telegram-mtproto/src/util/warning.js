//@flow
import { intersperse } from 'ramda'
import { isNode } from 'Runtime'

const objectFlagVariants = {
  browser: '%O',
  node   : `\n%j\n`,
}

const objectFlag = isNode
  ? objectFlagVariants.node
  : objectFlagVariants.browser

const newLine = `\n`

const warnString = '!! WARNING !!'

const issueLink = 'https://github.com/zerobias/telegram-mtproto/issues'

const issueString =
`This is most likely a problem with the telegram-mtproto itself.
Feel free to create an issue here ${issueLink}`


type WarnSpec = {
  isIssue: boolean,
  message: string | string[]
}

function prepareMessage(message: string | string[]): string[] {
  if (typeof message === 'string') return [message]
  if (message.length === 1) return [message[0], objectFlag]
  return intersperse(objectFlag, message)
}

function getMessage({ isIssue, message }: WarnSpec): string {
  let parts: string[] = [warnString, newLine]
  parts = parts.concat(prepareMessage(message))
  if (isIssue)
    parts.push(newLine, issueString)
  parts.push(newLine)
  return parts.join('')
}

export default function warning(spec: WarnSpec) {
  const message = getMessage(spec)
  return function doWarn(...data: any[]) {
    console.warn(message, ...data)
  }
}
