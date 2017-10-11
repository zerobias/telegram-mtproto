module Classify.Import where

import Classify.Message (Message, messageUnknown, apiError, apiResponse)
import Classify.Message.MessageIndex (MessageIndex, messageIndex)
import Classify.Message.Util (lookupArray, lookupTLType, (⨀))
import Data.Argonaut.Core (JObject, Json, toObject)
import Data.Array (catMaybes)
import Data.Maybe (Maybe(Just, Nothing), fromMaybe)
import Data.StrMap (lookup)
import Prelude (class Applicative, bind, pure, ($), (<$>), (<<<))

typeLookup :: ∀ a. (Json -> JObject -> String -> Maybe a) -> Json -> Maybe a
typeLookup fn rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  fn rawObj objMap tlType

objectLookup :: String -> JObject -> Maybe JObject
objectLookup field obj = do
  val <- lookup field obj
  toObject val

pureJust :: ∀ m a. Applicative m => Array (Maybe a) -> m (Array a)
pureJust = pure <<< catMaybes

smokeTest :: Json -> Array Message
smokeTest = (fromMaybe []) <<< (typeLookup classifyCarrier)

classifyCarrier :: Json -> JObject -> String -> Maybe (Array Message)
classifyCarrier objRaw objMap tlType = case tlType of
  "msg_container" -> do
    arr <- lookupArray objMap "messages"
    pureJust $ (typeLookup innerMessage) <$> arr
  "rpc_result" -> typeLookup singleMessage objRaw
  _ -> Nothing

innerMessage :: Json -> JObject -> String -> Maybe Message
innerMessage rawObj objMap tlType = do
  indx <- messageIndex objMap
  body <- case tlType of
    "message" -> objectLookup "body" objMap
    _ -> Nothing
  case objectLookup "result" body of
    Just result -> pure $ result ⨀ contentMessage indx result
    _ -> serviceMessage indx body

serviceMessage :: MessageIndex -> JObject -> Maybe Message
serviceMessage indx body =
  apiResponse indx body
  <$> lookupTLType body

contentMessage :: MessageIndex -> JObject -> Maybe String -> Message
contentMessage indx result bodyType = case bodyType of
  Just "rpc_error" -> apiError indx result
  Just type' -> apiResponse indx result type'
  _ -> messageUnknown

singleMessage :: Json -> JObject -> String -> Maybe (Array Message)
singleMessage rawObj objMap tlType = Just [messageUnknown]
