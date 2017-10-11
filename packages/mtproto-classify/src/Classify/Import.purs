module Classify.Import where

import Classify.Message (Message, messageUnknown, apiError, apiResponse)
import Classify.Message.MessageIndex (MessageIndex, messageIndex)
import Data.Argonaut.Core (JObject, JString, Json, toArray, toObject, toString)
import Data.Array (catMaybes)
import Data.Maybe (Maybe(Just, Nothing), fromMaybe)
import Data.StrMap (StrMap, lookup)
import Prelude (class Applicative, bind, pure, ($), (<$>), (<<<))

typeLookup :: ∀ a. (Json -> JObject -> String -> Maybe a) -> Json -> Maybe a
typeLookup fn rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  fn rawObj objMap tlType

lookupTLType :: StrMap Json -> Maybe JString
lookupTLType obj = do
  val <- lookup "_" obj
  toString val

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
    val <- lookup "messages" objMap
    arr <- toArray val
    pureJust $ (typeLookup innerMessage) <$> arr
  "rpc_result" -> pureJust $ (typeLookup singleMessage) <$> [objRaw]
  _ -> Nothing

innerMessage :: Json -> JObject -> String -> Maybe Message
innerMessage rawObj objMap tlType = do
  indx <- messageIndex objMap
  body <- case tlType of
    "message" -> objectLookup "body" objMap
    _ -> Nothing
  case objectLookup "result" body of
    Just result -> case lookupTLType result of
      Just "rpc_error" -> pure $ apiError indx result
      Just type' -> do
        respType <- lookupTLType body
        pure $ apiResponse indx result type'
      _ -> pure $ messageUnknown
    _ -> serviceMessage indx body

serviceMessage :: MessageIndex -> JObject -> Maybe Message
serviceMessage indx body = do
  tlType <- lookupTLType body
  pure $ apiResponse indx body tlType

-- contentMessage ::

singleMessage :: Json -> JObject -> String -> Maybe Message
singleMessage rawObj objMap tlType = Just messageUnknown
