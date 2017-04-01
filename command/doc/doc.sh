#!/usr/bin/env bash

echo '`Git book` server start'

cd doc/source
pwd
gitbook serve -p 4000 && open http://localhost:4000