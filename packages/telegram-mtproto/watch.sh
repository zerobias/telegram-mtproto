export DEBUG=telegram-mtproto:*,-telegram-mtproto:tl:*
debugDef=telegram-mtproto:*,-telegram-mtproto:tl:*

debugVar=$debugDef
debugPrefix=telegram-mtproto:
exclude='-telegram-mtproto:*'

state='cmd'

debugDeclaration() {
  update=$debugPrefix$1','$debugPrefix$1':*'
  case $debugVar in
    '')   debugVar=$update
          ;;
    * )   debugVar=$debugVar','$update
  esac
  echo 'debugVar' $debugVar
}

setState() {
  state=$1
}

arg() {
  case $state in
    'cmd')    ;;
    'debug')  debugDeclaration $1
              ;;
    * )       echo 'unknown state' $state $1
              exit 1
              ;;
  esac
}

while [ "$1" != "" ]; do
  case $1 in
    -d | --debug )          shift
                            debugVar=
                            setState 'debug'
                            arg $1
                            ;;
    -h | --help )           arg $1
                            ;;
    * )                     arg $1
                            ;;
  esac
  shift
done


echo 'DEBUG='$debugVar
export DEBUG=$debugVar
export NODE_ENV=development
export MTPROTO_ENV=development
nodemon -q --watch lib --delay 1 -x "clear && jest test/node.test.js"
