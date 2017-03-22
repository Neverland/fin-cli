#!/usr/bin/env bash

# 1.在cli 里面调用cli
# 2.不能获取改cli（gitbook）的stdout，也没有办法获取改cli状态
# 3.所以采用这种形式

echo 'server start'

cd doc/source
gitbook serve -p 4000
open http://localhost:4000
