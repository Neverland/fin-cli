echo '`Git book` server start'

cd doc/source
gitbook serve -p 4000
open http://localhost:4000