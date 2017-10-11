module Classify.Message where

import Classify.Message.Util

import Classify.Message.Error (MTError, mtError, TLError, tlError)
import Classify.Message.MessageIndex (MessageIndex)
import Classify.Message.Response (MTResponse(..))
import Data.Argonaut.Core (JObject, Json, toNumber, toString)
import Data.Int (floor)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.StrMap (lookup)
import Data.Traversable (traverse)
import Prelude (class Show, bind, negate, pure, show, (#), ($), (<$>), (<*>))



-- type Response = forall a. { "_" :: String | a }

type Code = Int
type MessageText = String

data Message =
  ApiResponse (Maybe JObject) MTResponse MessageIndex
  | ApiError TLError MTError MessageIndex
  | MessageUnknown

instance showApiResponse :: Show Message where
  show (ApiResponse (Just msg) resp indx) =
    "ApiResponse"
      ⇶ show resp
      ↵ show indx
  show (ApiResponse Nothing resp indx) =
    "ApiResponse" ∾ "(no body)"
      ⇶ show resp
      ↵ show indx
  show (ApiError tlErr mtErr indx) =
    "ApiError"
      ⇶ show mtErr
      ↵ show tlErr
      ↵ show indx
  show MessageUnknown = "MessageUnknown ()"


apiError :: MessageIndex -> JObject -> Message
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
  result = ApiError
    (tlError code message)
    (mtError message code)
    indx

apiResponse :: MessageIndex -> JObject -> String -> Message
apiResponse indx resultData type' = ApiResponse
  (Just resultData)
  (chooseMTResponse type' resultData)
  indx

messageUnknown :: Message
messageUnknown = MessageUnknown

chooseMTResponse :: String -> JObject -> MTResponse
chooseMTResponse type' data' = case type' of
  "msg_detailed_info" -> DetailedInfo
  "msg_new_detailed_info" -> NewDetailedInfo
  "msgs_ack" -> (Ack $ getStringList data' "msg_ids")

  "new_session_created" -> newSession data'
  t -> (MTResponse t)


newSession :: JObject -> MTResponse
newSession obj =
  NewSession
    <$> obj 🅢 "first_msg_id"
    <*> obj 🅢 "server_salt"
    # fromMaybe MTResponseUnknown

getStringList :: JObject -> String -> Array String
getStringList obj field = (fromMaybe []) $ do
  arr <- lookupArray obj field
  toStringArray arr

toStringArray :: Array Json -> Maybe (Array String)
toStringArray = traverse (toString)

tlType :: JObject -> String
tlType strMap = strMap ⨀ fromMaybe "No type"

