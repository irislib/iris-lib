FROM node:current-alpine AS iris-base

#ARG NODE_ENV=production
ARG NODE_ENV=test
ENV NODE_ENV=$NODE_ENV

ENV BUILD_DEPENDENCIES \
  python \
  make \
  g++
ENV TEST_DEPENDENCIES \
  git

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock ./

RUN apk update && apk upgrade \
  && apk add --no-cache --virtual .build-dependencies $BUILD_DEPENDENCIES \
  && apk add --no-cache $TEST_DEPENDENCIES
RUN yarn install
RUN yarn install --production=true --modules-folder ./yarn_prod
RUN apk del .build-dependencies

# ============================================= #

FROM iris-base AS iris-lib
WORKDIR /app

COPY . .

RUN yarn build:cjs
RUN yarn build:es
RUN yarn build:umd
RUN yarn build:docs

# ============================================= #

FROM iris-lib AS iris-lib-test
CMD ['yarn', 'test:all']

# ============================================= #

FROM node:current-alpine AS irisnode-base

# Parameters for the container:

# RECOMMENDED:
# Persist stand-alone configuration, cache, keyfiles between sessions
# -v /app/.iris/

# OPTIONAL: Use external index / key files. Mount these directly, or use secrets mechanism of your docker host.
# Map index config file
# -v ./index.json:/app/index.json
# Use keyfile (note: if not provided, a new key file is created)
# -v ./keys.json:/app/keys.json

# IRIS_ENV: production -> connects to peers, anything else -> doesn't
ARG IRIS_INDEX_CONFIG=""
ARG IRIS_KEYFILE=""
ARG IRIS_ENV=dev

ENV IRIS_INDEX_CONFIG=$IRIS_INDEX_CONFIG
ENV IRIS_KEYFILE=$IRIS_KEYFILE
ENV IRIS_ENV=$IRIS_ENV

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 8765

RUN mkdir -p /app/.iris
WORKDIR /app

# Yarn dependencies, built libs, service-wrapper
COPY --from=iris-lib /app/dist/*.js /app/package.json /app/yarn.lock /app/config.default.json ./
COPY --from=iris-lib /app/cjs /app/cjs

# ============================================= #

FROM irisnode-base AS irisnode-prod

COPY --from=iris-lib /app/yarn_prod /app/node_modules
ENV NODE_ENV='production'

CMD ["yarn", "serve"]

# ============================================= #

FROM irisnode-base AS irisnode-dev

COPY --from=iris-lib /app/node_modules /app/node_modules
COPY .*rc ./

CMD ["yarn", "dev"]
