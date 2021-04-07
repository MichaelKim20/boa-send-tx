# From Agora Runner
FROM node:14.15.4-alpine3.12
RUN apk add --no-cache git py-pip alpine-sdk \
    bash autoconf libtool automake

WORKDIR /sendtx/wd/

ADD . /sendtx/bin/
RUN npm ci --prefix /sendtx/bin/

# Starts a node process, which compiles TS and watches `src` for changes
ENTRYPOINT [ "/sendtx/bin/docker/entrypoint.sh" ]
