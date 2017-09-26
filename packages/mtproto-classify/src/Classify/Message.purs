module Classify.Message where

import Data.Argonaut.Core
import Data.Maybe
-- import Data.Tuple
import Prelude

import Data.StrMap

type TLError = {
  code :: Number,
  message :: String
}

type Response = forall a. { "_" :: String | a }

data Message = Message {
  response :: Maybe Response,
  error :: Maybe TLError
}

data Msg =
  ApiResponse (Maybe (StrMap Json))
  | ApiError Number String
  | MessageUnknown

instance showApiResponse :: Show Msg where
  show (ApiResponse (Just msg)) = "Message ApiResponse (" <> (tlType msg) <> ")"
  show (ApiResponse Nothing) = "Message ApiResponse (void)"
  show (ApiError code message) = "Message ApiError (code "
    <> (show code)
    <> ", message "
    <> (show message)
    <> ")"
  show MessageUnknown = "MessageUnknown ()"

apiError :: StrMap Json -> Msg
apiError resultData = ApiError code message where
  maybeMsg = do
    field <- lookup "error_message" resultData
    toString field
  maybeCode = do
    field <- lookup "error_code" resultData
    toNumber field

  message :: String
  message = ((maybe "Unknown error") \x -> x) maybeMsg

  code :: Number
  code = ((maybe (-1.0)) \x -> x) maybeCode

tlType :: StrMap Json -> String
tlType strMap = ((maybe "No type") \x -> x) $ do
  field <- lookup "_" strMap
  toString field

