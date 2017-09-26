module Main where

import Classify.Import (smokeTest)
import Control.Monad.Eff (Eff, kind Effect)
import Control.Monad.Eff.Console (logShow, CONSOLE)

import Data.Argonaut.Core (Json)

import Prelude

foreign import rawExample :: Json
foreign import messageExample :: Json

main :: forall t7. Eff (console :: CONSOLE| t7) Unit
main = do
  logShow $ smokeTest rawExample
  logShow $ smokeTest messageExample

