module Classify.Message.Util where

import Data.Argonaut (JObject, JString, Json, toArray, toString)
import Data.Foldable (class Foldable, foldl)
import Data.Maybe (Maybe)
import Data.StrMap (lookup)
import Data.String (Pattern(Pattern), split)
import Prelude (bind, otherwise, ($), (+), (-), (<), (<=), (<>), (==))

inBrackets :: String -> String
inBrackets text = "[" <> text <> "]"

newLine :: String -> String -> String
newLine a b = a <> "\n" <> b

infixl 2 newLine as ↵

-- isSpace :: Char -> Boolean

foreign import detectIdent :: String -> Int
-- detectIdent = count isSpace

foreign import ensureNewLine :: String -> String

spaceBar :: Int -> String
spaceBar n | n <= 0 = ""
spaceBar 1 = " "
spaceBar 2 = "  "
spaceBar 3 = "   "
spaceBar 4 = "    "
spaceBar n = spaceBar 4 <> spaceBar (n - 4)

splitLines :: String -> Array String
splitLines = split $ Pattern "\n"

ensurePadding :: Int -> Int -> String -> String
ensurePadding need have str
  | need == have = str
  | need < have = str ⟝ need
  | otherwise = str ⟝ (need - have)

joinWithPadding :: Int -> String -> String -> String
joinWithPadding n "" str = str ⟝ n
joinWithPadding n acc str =
  acc ↵
  str ⟝ n

foldJoinLines :: ∀ m. Foldable m => Int -> m String -> String
foldJoinLines n = foldl (joinWithPadding n) ""

addPadding :: Int -> String -> String
addPadding n str = foldJoinLines n (splitLines str)

-- infix 1 addPadding as ⇶
-- ↸ ⬱

paragraph :: String -> String -> String
paragraph header text =
  header ↵ (addPadding ident text) where
    ident = detectIdent header + 2

infixl 1 paragraph as ⇶

padding :: String -> Int -> String
padding str n = spaceBar n <> str

infixl 6 padding as ⟝

space :: String -> String -> String
space a b = a <> " " <> b

infixl 4 space as ∾

keyValue :: String -> String -> String
keyValue a b = a <> ":" ∾ b

infix 8 keyValue as ☍

lookupTLType :: JObject -> Maybe JString
lookupTLType obj = do
  val <- lookup "_" obj
  toString val

lookupOperator :: ∀ t. JObject -> (Maybe JString -> t) -> t
lookupOperator obj fn = fn $ lookupTLType obj

infixl 7 lookupOperator as ⨀

lookupArray :: JObject -> String -> Maybe (Array Json)
lookupArray obj str = do
  val <- lookup str obj
  toArray val

-- infixl 7 lookupArray as ⟽

lookupString :: JObject -> String -> Maybe String
lookupString obj field = do
  val <- lookup field obj
  toString val

infixl 7 lookupString as 🅢
