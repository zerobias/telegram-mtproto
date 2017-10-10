module Classify.Message where

import Classify.Message.Response (MTResponse(..))
import Data.Argonaut.Core (Json, toNumber, toString)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.StrMap (StrMap, lookup)
import Prelude (class Show, bind, negate, pure, show, ($), (<>))

import Classify.Message.Error (MTError, mtError)
import Classify.Message.MessageIndex (MessageIndex)
import Data.Int (floor)



-- type Response = forall a. { "_" :: String | a }

type Code = Int
type MessageText = String

data Message =
  ApiResponse (Maybe (StrMap Json)) MTResponse MessageIndex
  | ApiError Code MessageText MTError MessageIndex
  | MessageUnknown

instance showApiResponse :: Show Message where
  show (ApiResponse (Just msg) resp indx) = "ApiResponse "
    <> show resp
    <> " ("
    <> tlType msg
    <> ") "
    <> show indx
  show (ApiResponse Nothing resp indx) = "ApiResponse (no body) "
    <> show resp
    <> show indx
  show (ApiError code message mtErr indx) = "ApiError "
    <> (show mtErr)
    <> " (code "
    <> (show code)
    <> ", message "
    <> (show message)
    <> ")"
    <> show indx
  show MessageUnknown = "MessageUnknown ()"


apiError :: MessageIndex -> (StrMap Json) -> Message
apiError indx resultData = result where
  message :: String
  message = fromMaybe "Unknown error" $ do
    field <- lookup "error_message" resultData
    toString field
  code :: Int
  code = fromMaybe (-1) $ do
    field <- lookup "error_code" resultData
    num <- toNumber field
    pure $ floor num
  result :: Message
  result = ApiError code message (mtError { code, message }) indx

apiResponse :: MessageIndex -> StrMap Json -> Message
apiResponse indx resultData =
  ApiResponse (Just resultData) (chooseMTResponse resultData) indx

messageUnknown :: Message
messageUnknown = MessageUnknown

chooseMTResponse :: StrMap Json -> MTResponse
chooseMTResponse resultData = case tlType resultData of
  "msg_detailed_info" -> DetailedInfo
  "msg_new_detailed_info" -> NewDetailedInfo
  "msgs_ack" -> Ack
  _ -> MTResponse

tlType :: StrMap Json -> String
tlType strMap = fromMaybe "No type" $ do
  field <- lookup "_" strMap
  toString field

