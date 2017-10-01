module Classify.Message.Error (MTError, mtError, TLError) where

import Prelude

import Data.String.Regex (Regex, match, test)
import Data.Maybe (Maybe, fromMaybe)
import Data.Int (floor)
import Global (readInt)

import Classify.Message.Util (inBrackets)

type TLError = {
  code :: Int,
  message :: String
}

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
    <> " You must wait "
    <> show time
    <> " seconds"
  show (Migrate dc) = inBrackets "Migrate" <> " " <> show dc
  show (FileMigrate dc) = inBrackets "File migrate" <> " " <> show dc
  show AuthKeyUnregistered = inBrackets "Auth key unregistered"
  show AuthRestart = inBrackets "Auth restart"
  show OtherError = inBrackets "Other error"

foreign import migrate :: Regex
foreign import fileMigrate :: Regex
foreign import floodWait :: Regex

mtError :: TLError -> MTError
mtError { message }
  | test floodWait message = FloodWait $ intFromError floodWait message
  | test migrate message = Migrate $ intFromError migrate message
  | test fileMigrate message = FileMigrate $ intFromError fileMigrate message
mtError { message: "AUTH_KEY_UNREGISTERED" } = AuthKeyUnregistered
mtError { message: "AUTH_RESTART" } = AuthRestart
mtError _ = OtherError

intFromError :: Regex -> String -> Dc
intFromError ex message = (fromMaybe 0) $ do
  arr <- match ex message
  pure case arr of
    [_, _, strNum] -> readParsedInt strNum
    _ -> 0

readParsedInt :: Maybe String -> Int
readParsedInt = floor <<< (readInt 10) <<< (fromMaybe "")
