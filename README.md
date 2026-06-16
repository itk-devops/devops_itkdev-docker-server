# Docker compose server

Simple wrapper around `docker compose`.

> [!WARNING]
> ## Needs refactor
> We depend on the archived and unmaintained [pkg](https://www.npmjs.com/package/pkg). Pkg recommends Node.js 21’s 
> support for [single executable applications](https://nodejs.org/api/single-executable-applications.html) as an 
> possible alternative.

## Development

``` shell
task dev:install
task dev:build
```

Run `task dev:build --force` to force a rebuild of the `itkdev-docker-compose-server` binary.
