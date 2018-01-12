module Classify.Import where

import Classify.Message (Message, apiError, apiResponse, messageUnknown, tlType)
import Classify.Message.MessageIndex (MessageIndex, messageIndex)
import Classify.Message.Util (lookupArray, lookupTLType, (⨀))
import Control.Monad.State (StateT(..), get, lift, put)
import Data.Argonaut.Core (JObject, Json, toObject)
import Data.Array (catMaybes)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), fromMaybe)
import Data.StrMap (StrMap, lookup)
import Data.String (drop, take)
import Prelude (class Applicative, bind, pure, ($), (<$>), (<<<), discard)

typeLookup :: ∀ a. (Json -> JObject -> String -> Maybe a) -> Json -> Maybe a
typeLookup fn rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  fn rawObj objMap tlType

type TypeContext = {
  rawObj :: Json,
  objMap :: StrMap Json,
  tlType :: String
}

typeLookupShape :: ∀ t7 t8.
  t7 -> t8 -> Json -> Maybe TypeContext
typeLookupShape fn rawObj = typeLookup \rawObj objMap tlType -> Just {
  rawObj,
  objMap,
  tlType
}


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


split :: StateT String (Either String) String
split = do
  s <- get
  case s of
    "" -> lift $ Left "Empty string"
    _ -> do
      put (drop 1 s)
      pure (take 1 s)

innerMessage :: Json -> JObject -> String -> Maybe Message
innerMessage rawObj objMap tlType = do
  indx <- messageIndex objMap
  body <- case tlType of
    "message" -> objectLookup "body" objMap
    _ -> Nothing
  case objectLookup "result" body of
    Just result -> pure $ result ⨀ contentMessage indx body result
    _ -> serviceMessage indx body

serviceMessage :: MessageIndex -> JObject -> Maybe Message
serviceMessage indx body =
  (apiResponse indx body Nothing)
  <$> (lookupTLType body)

contentMessage :: MessageIndex -> JObject -> JObject -> Maybe String -> Message
contentMessage indx body result bodyType = case bodyType of
  Just "rpc_error" -> apiError indx result
  Just type' -> apiResponse indx body (Just result) type'
  _ -> messageUnknown

singleMessage :: Json -> JObject -> String -> Maybe (Array Message)
singleMessage rawObj objMap tlType = Just [messageUnknown]
