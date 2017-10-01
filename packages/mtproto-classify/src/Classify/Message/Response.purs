module Classify.Message.Response where

import Prelude

import Classify.Message.Util (inBrackets)

data MTResponse =
  DetailedInfo
  | NewDetailedInfo
  | Ack
  | MTResponse

instance showMTResponse :: Show MTResponse where
  show DetailedInfo = inBrackets "Detailed info"
  show NewDetailedInfo = inBrackets "New detailed info"
  show Ack = inBrackets "Ack"
  show MTResponse = inBrackets "Response"
