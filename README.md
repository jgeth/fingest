<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


## Description

FINGEST: A sample financial data application using the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn
```

## Fetching the data

```bash
$ yarn fetch
```

## Ingesting the data

```bash
$ yarn ingest
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

REST API endpoints:

* http://localhost:3000/ <- greeting
* http://localhost:3000/submission <- All submissions (limited to 20)
* http://localhost:3000/submission/:adsh <- Submission by ID (adsh)

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
