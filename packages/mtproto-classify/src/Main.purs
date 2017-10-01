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

-- type ConsoleEff = forall eff. Eff (console :: CONSOLE | eff) Unit

testPrint :: forall t9. Json -> Eff ( console :: CONSOLE | t9 ) (Array Unit)
testPrint = (traverse logShow) <<< (fromMaybe []) <<< smokeTest

main :: forall t20. Eff ( console :: CONSOLE | t20 ) (Array Unit)
main = do
  _ <- testPrint rawExample
  testPrint messageExample
  -- logShow "--"
