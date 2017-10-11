module Main where

import Prelude

import Classify.Import (smokeTest)
import Classify.Message.Util ((∾))
import Control.Monad.Eff (Eff, kind Effect)
import Control.Monad.Eff.Console (log, logShow, CONSOLE)
import Data.Argonaut.Core (Json)
import Data.Traversable (traverse)

foreign import rawExample :: Json
foreign import messageExample :: Json
foreign import newSessionAndAck :: Json
foreign import detailedInfoAndUpdShort :: Json


testPrint :: ∀ eff. Json -> Eff ( console :: CONSOLE | eff ) (Array Unit)
testPrint = (traverse logShow) <<< smokeTest

namedTest :: ∀ eff. String -> Json -> Eff ( console :: CONSOLE | eff ) (Array Unit)
namedTest tag val = do
  _ <- log ("\n" <> "---" ∾ tag ∾ "---")
  testPrint val

-- detailedInfoAndUpdShort

main :: ∀ eff. Eff ( console :: CONSOLE | eff ) (Array Unit)
main = do
  _ <- namedTest "rawExample" rawExample
  _ <- namedTest "new session / ack" newSessionAndAck
  _ <- namedTest "detailed info / update short" detailedInfoAndUpdShort
  testPrint messageExample
  -- logShow "--"
