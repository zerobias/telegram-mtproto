module Classify.Message.MessageIndex (MessageIndex, messageIndex, parseMsgId, parseSeqno) where

import Classify.Message.Util
import Prelude

import Control.Apply (class Apply, lift2, (<*>))
import Data.Argonaut.Core (Json, JObject, toNumber, toString)
import Data.Int (fromNumber)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, lookup)

parseMsgId :: StrMap Json -> Maybe String
parseMsgId obj = do
  msg_id <- lookup "msg_id" obj
  toString msg_id

parseSeqno :: StrMap Json -> Maybe Int
parseSeqno obj = do
  seqno <- lookup "seqno" obj
  num <- toNumber seqno
  fromNumber num

type Seqno = Int
type MsgId = String

data MessageIndex = MessageIndex Seqno MsgId

instance showMessageIndex :: Show MessageIndex where
  show (MessageIndex seq msg) =
    "MessageIndex"
      ⇶ "seq" ☍ show seq
      ↵ "msg" ☍ show msg

messageIndex :: JObject -> Maybe MessageIndex
messageIndex obj =
  (lift2 $ MessageIndex)
  (parseSeqno obj)
  (parseMsgId obj)

-- plainMessageIndex :: ∀ λ. Apply λ => λ Int