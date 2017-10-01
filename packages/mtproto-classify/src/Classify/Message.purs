module Classify.Message where

import Classify.Message.Error (MTError, mtError)
import Classify.Message.Response

import Data.Argonaut.Core
import Data.Maybe
import Prelude

import Data.StrMap
import Data.Int (floor)



-- type Response = forall a. { "_" :: String | a }

data Message =
  ApiResponse (Maybe (StrMap Json)) MTResponse
  | ApiError Int String MTError
  | MessageUnknown

instance showApiResponse :: Show Message where
  show (ApiResponse (Just msg) resp) = "ApiResponse " <> show resp <> " (" <> (tlType msg) <> ") "
  show (ApiResponse Nothing resp) = "ApiResponse (no body) " <> show resp
  show (ApiError code message mtErr) =
    "ApiError "
    <> (show mtErr)
    <> " (code "
    <> (show code)
    <> ", message "
    <> (show message)
    <> ")"
  show MessageUnknown = "MessageUnknown ()"

apiError :: StrMap Json -> Message
apiError resultData = ApiError code message (mtError { code, message }) where
  message :: String
  message = fromMaybe "Unknown error" $ do
    field <- lookup "error_message" resultData
    toString field
  code :: Int
  code = fromMaybe (-1) $ do
    field <- lookup "error_code" resultData
    num <- toNumber field
    pure $ floor num

apiResponse :: StrMap Json -> Message
apiResponse resultData = ApiResponse (Just resultData)
  case tlType resultData of
    "msg_detailed_info" -> DetailedInfo
    "msg_new_detailed_info" -> NewDetailedInfo
    "msgs_ack" -> Ack
    _ -> MTResponse

tlType :: StrMap Json -> String
tlType strMap = fromMaybe "No type" $ do
  field <- lookup "_" strMap
  toString field

