module Classify.Import where

import Classify.Message (Message, messageUnknown, apiError, apiResponse)
import Classify.Message.MessageIndex (MessageIndex, messageIndex)
import Data.Argonaut.Core (JObject, JString, Json, toArray, toObject, toString)
import Data.Array (catMaybes)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.StrMap (StrMap, lookup)
import Data.Tuple (Tuple(..))
import Prelude (class Applicative, bind, pure, ($), (<$>), (<<<))

type RawMessageTuple = Tuple MessageIndex JObject

typeLookup :: ∀ a. (Json -> JObject -> String -> Maybe a) -> Json -> Maybe a
typeLookup fn rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  fn rawObj objMap tlType

lookupTLType :: StrMap Json -> Maybe JString
lookupTLType obj = do
  val <- lookup "_" obj
  toString val

getRpcResult :: StrMap Json -> Maybe JObject
getRpcResult obj = do
  tlType <- lookupTLType obj
  result <- case tlType of
    "rpc_result" -> do
      val <- lookup "result" obj
      toObject val
    _ -> Nothing
  pure result

pureJust :: ∀ m a. Applicative m => Array (Maybe a) -> m (Array a)
pureJust = pure <<< catMaybes

maybeArray :: ∀ a. Maybe (Array a) -> Array a
maybeArray = fromMaybe []

smokeTest :: Json -> Maybe (Array Message)
smokeTest objRaw = do
  tuples <- typeLookup classifyCarrier objRaw
  pure $ makeMsg <$> tuples

classifyCarrier :: Json -> JObject -> String -> Maybe (Array RawMessageTuple)
classifyCarrier objRaw objMap tlType = case tlType of
  "msg_container" -> do
    val <- lookup "messages" objMap
    arr <- toArray val
    pureJust $ (typeLookup messageNormalize) <$> arr
  "rpc_result" -> do
    val <- typeLookup messageNormalize objRaw
    Just [val]
  _ -> Nothing

messageNormalize :: Json -> JObject -> String -> Maybe RawMessageTuple
messageNormalize rawObj objMap tlType = do
  res <- case tlType of
    "message" -> lookup "body" objMap
    "rpc_result" -> Just rawObj
    _ -> Nothing
  asObj <- toObject res
  rpcResult <- getRpcResult asObj
  messageIndexTuple objMap rpcResult

messageIndexTuple :: JObject -> JObject -> Maybe RawMessageTuple
messageIndexTuple objMap obj = do
  indx <- messageIndex objMap
  pure $ Tuple indx obj

msgIndex :: Json -> Maybe MessageIndex
msgIndex obj = do
  objMap <- toObject obj
  messageIndex objMap

makeMsg :: RawMessageTuple -> Message
makeMsg (Tuple indx resultData) = case lookupTLType resultData of
  Just "rpc_error" -> apiError indx resultData
  Just _ -> apiResponse indx resultData
  Nothing -> messageUnknown
