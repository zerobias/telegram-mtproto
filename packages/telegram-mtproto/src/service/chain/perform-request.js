//@flow

import { NetMessage } from '../networker/net-message'
import { TypeWriter } from '../../tl/type-buffer'
import { writeInt, writeIntBytes, writeLong } from '../../tl/writer'

type WriteInner = {
  writer: TypeWriter,
  messages: NetMessage[]
}

export function writeInnerMessage({ writer, messages }: WriteInner) {
  const innerMessages: string[] = []
  const noResponseMessages: string[] = []
  for (let i = 0; i < messages.length; i++) {
    const msg: NetMessage = messages[i]
    writeLong(writer, msg.msg_id)
    innerMessages.push(msg.msg_id)
    writeInt(writer, msg.seq_no)
    writeInt(writer, msg.body.length)
    writeIntBytes(writer, msg.body, false)
    if (msg.noResponse)
      noResponseMessages.push(msg.msg_id)
  }

  return {
    innerMessages,
    noResponseMessages
  }
}
