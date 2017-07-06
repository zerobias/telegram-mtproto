//@flow

import { NetMessage } from '../networker/net-message'
import { TypeWriter } from '../../tl/type-buffer'
import { writeInt, writeIntBytes, writeLong } from '../../tl/writer'

type SendRequest ={
  message: NetMessage,
  url: string,
  writer: TypeWriter
}

type WriteInner = {
  writer: TypeWriter,
  messages: NetMessage[]
}

export const writeInnerMessage =
  ({ writer, messages }: WriteInner) => {
    const innerMessages: string[] = []
    const noResponseMessages: string[] = []
    messages.forEach((msg: NetMessage, i: number) => {
      writeLong(writer, msg.msg_id, `CONTAINER[${i}][msg_id]`)
      innerMessages.push(msg.msg_id)
      writeInt(writer, msg.seq_no, `CONTAINER[${i}][seq_no]`)
      writeInt(writer, msg.body.length, `CONTAINER[${i}][bytes]`)
      writeIntBytes(writer, msg.body, false)
      if (msg.noResponse)
        noResponseMessages.push(msg.msg_id)
    })

    return {
      innerMessages,
      noResponseMessages
    }
  }

