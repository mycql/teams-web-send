## Setup

Clone the repo

```sh
git clone https://github.com/mycql/teams-web-send.git
cd teams-web-send
npm ci
```
Then you can either run:
```sh
npm run build
```
to do a one-off build or
```sh
npm start
```
to have incremental builds and watch files on change (a.k.a devmode).

You can access the built files for individual packages under the *dist* folder.

### Running on devmode
If you're on devmode, you can try sending out messages by visiting:

http://localhost:3000

### TSDX
Note: To understand more on the build tooling used by this project, you can visit the [TSDX](https://tsdx.io/) project site.
