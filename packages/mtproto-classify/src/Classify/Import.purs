module Classify.Import (smokeTest) where

import Classify.Message (Message(..), apiError, apiResponse)
import Data.Argonaut.Core (JObject, JString, Json, toArray, toObject, toString)
import Data.Array (catMaybes)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, lookup)
import Prelude (class Applicative, bind, pure, ($), (<$>), (<<<))

lookupTLType :: StrMap Json -> Maybe JString
lookupTLType obj = do
  val <- lookup "_" obj
  toString val

getResultData :: StrMap Json -> Maybe JObject
getResultData obj = do
  tlType <- lookupTLType obj
  result <- case tlType of
    "rpc_result" -> do
      val <- lookup "result" obj
      toObject val
    _ -> Nothing
  pure result

pureJust :: forall t5 t7. Applicative t5 => Array (Maybe t7) -> t5 (Array t7)
pureJust = pure <<< catMaybes


smokeTest :: Json -> Maybe (Array Message)
smokeTest objRaw = do
  obj <- toObject objRaw
  tlType <- lookupTLType obj
  body <- case tlType of
    "msg_container" -> do
      val <- lookup "messages" obj
      arr <- toArray val
      pureJust $ messageNormalize <$> arr
    "rpc_result" -> do
      val <- messageNormalize objRaw
      Just [val]
    _ -> Nothing
  pure $ makeMsg <$> body
  -- pure result


messageNormalize :: Json -> Maybe (StrMap Json)
messageNormalize rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  res <- case tlType of
    "message" -> lookup "body" objMap
    "rpc_result" -> Just rawObj
    _ -> Nothing
  asObj <- toObject res
  resultData <- getResultData asObj
  pure resultData

makeMsg :: StrMap Json -> Message
makeMsg resultData = case lookupTLType resultData of
  Just "rpc_error" -> apiError resultData
  Just _ -> apiResponse resultData
  Nothing -> MessageUnknown
