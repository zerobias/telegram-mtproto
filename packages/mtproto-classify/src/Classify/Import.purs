module Classify.Import where

import Classify.Message
import Data.Argonaut.Core
import Data.Array
import Data.Maybe
import Data.StrMap
import Prelude

lookupTLType :: StrMap Json -> Maybe JString
lookupTLType obj = do
  val <- lookup "_" obj
  toString val

lookupContainerData :: StrMap Json -> Maybe JArray
lookupContainerData obj = do
  val <- lookup "messages" obj
  toArray val


lookupResultData :: StrMap Json -> Maybe JObject
lookupResultData obj = do
  val <- lookup "result" obj
  toObject val


getResultData :: StrMap Json -> Maybe (StrMap Json)
getResultData obj = do
  tlType <- lookupTLType obj
  result <- case tlType of
    "rpc_result" -> lookupResultData obj
    _ -> Nothing
  pure result

pureJust :: forall t5 t7. Applicative t5 => Array (Maybe t7) -> t5 (Array t7)
pureJust = pure <<< catMaybes


smokeTest :: Json -> Maybe (Array Msg)
smokeTest objRaw = do
  obj <- toObject objRaw
  tlType <- lookupTLType obj
  body <- case tlType of
    "msg_container" -> do
      arr <- lookupContainerData obj
      pureJust $ messageFabric <$> arr
    _ -> Nothing
  pure $ makeMsg <$> body
  -- pure result


messageFabric :: Json -> Maybe (StrMap Json)
messageFabric rawObj = do
  objMap <- toObject rawObj
  tlType <- lookupTLType objMap
  res <- case tlType of
    "message" -> lookup "body" objMap
    _ -> Nothing
  asObj <- toObject res
  resultData <- getResultData asObj
  pure resultData

makeMsg :: StrMap Json -> Msg
makeMsg resultData = case lookupTLType resultData of
  Just "rpc_error" -> apiError resultData
  Just _ -> ApiResponse (Just resultData)
  Nothing -> MessageUnknown
