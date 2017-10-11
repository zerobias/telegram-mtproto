module Classify.Message.Error (MTError, mtError, TLError, tlError) where

import Prelude

import Classify.Message.Util (inBrackets, (↵), (☍), (⇶), (∾))
import Data.Int (decimal, floor, toStringAs)
import Data.Maybe (Maybe, fromMaybe)
import Data.String.Regex (Regex, match, test)
import Global (readInt)

data TLError = TLError Int String

instance showTLError :: Show TLError where
  show (TLError code message) =
    "TL error"
      ⇶ "code"    ☍ show code
      ↵ "message" ☍ show message

tlError :: Int -> String -> TLError
tlError code message = TLError code message

type Dc = Int

data MTError =
  FloodWait Dc
  | Migrate Dc
  | FileMigrate Dc
  | AuthKeyUnregistered
  | AuthRestart
  | OtherError

instance showMTError :: Show MTError where
  show (FloodWait time) =
    inBrackets "Flood wait"
      ⇶ "You must wait"
      ∾ intToString time
      ∾ "seconds"
  show (Migrate dc) = inBrackets "Migrate" <> " " <> show dc
  show (FileMigrate dc) = inBrackets "File migrate" <> " " <> show dc
  show AuthKeyUnregistered = inBrackets "Auth key unregistered"
  show AuthRestart = inBrackets "Auth restart"
  show OtherError =
    inBrackets "Other error"
      ⇶ "no info"

foreign import migrate :: Regex
foreign import fileMigrate :: Regex
foreign import floodWait :: Regex

mtError :: String -> Int -> MTError
mtError message _
  | test floodWait message =
    FloodWait $ intFromError floodWait message
  | test migrate message =
    Migrate $ intFromError migrate message
  | test fileMigrate message =
    FileMigrate $ intFromError fileMigrate message
mtError "AUTH_KEY_UNREGISTERED" _ = AuthKeyUnregistered
mtError "AUTH_RESTART" _ = AuthRestart
mtError _ _ = OtherError

intFromError :: Regex -> String -> Dc
intFromError ex message = (fromMaybe 0) $ do
  arr <- match ex message
  pure case arr of
    [_, _, strNum] -> readParsedInt strNum
    _ -> 0

readParsedInt :: Maybe String -> Int
readParsedInt = floor <<< (readInt 10) <<< (fromMaybe "")

intToString :: Int -> String
intToString = toStringAs decimal
