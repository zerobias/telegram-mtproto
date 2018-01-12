module Classify.Message.Response where

import Prelude

import Classify.Message.Util (inBrackets, (↵), (⇶), (☍))

type MsgId = String
type Salt = String

data MTResponse =
  DetailedInfo
  | NewDetailedInfo
  | Ack (Array String)
  | MTResponse String String
  | NewSession MsgId Salt
  | MTResponseUnknown

instance showMTResponse :: Show MTResponse where
  show DetailedInfo = inBrackets "Detailed info"
  show NewDetailedInfo = inBrackets "New detailed info"
  show (Ack ids) = "Ack" ⇶
    "ids" ☍ show ids
  show (MTResponse type' reqMsg) =
    "Response"
      ⇶ "type"    ☍ type'
      ↵ "req msg" ☍ reqMsg
  show (NewSession msg salt) =
    "New session"
      ⇶ "first msg" ☍ msg
      ↵ "salt"      ☍ salt
  show MTResponseUnknown = inBrackets "MT response unknown"

