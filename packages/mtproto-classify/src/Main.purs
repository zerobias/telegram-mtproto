module Main where

import Prelude

import Classify.Import (smokeTest)
import Control.Monad.Eff (Eff, kind Effect)
import Control.Monad.Eff.Console (logShow, CONSOLE)
import Data.Argonaut.Core (Json)
import Data.Maybe (fromMaybe)
import Data.Traversable (traverse)

foreign import rawExample :: Json
foreign import messageExample :: Json

testPrint :: ∀ eff. Json -> Eff ( console :: CONSOLE | eff ) (Array Unit)
testPrint = (traverse logShow) <<< (fromMaybe []) <<< smokeTest

main :: ∀ eff. Eff ( console :: CONSOLE | eff ) (Array Unit)
main = do
  _ <- testPrint rawExample
  testPrint messageExample
  -- logShow "--"
