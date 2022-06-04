<h1 align="center">
  <img align="center" src="https://raw.githubusercontent.com/lite-us/liteweb/master/assets/LiteWeb-logo.png" width="400"/>
</h1>

<p align="center">
  <a href="https://discord.gg/GsRgsTD">
    <img src="https://img.shields.io/badge/chat-on%20discord-brightgreen.svg">
  </a>

  <a href="https://github.com/lite-us/liteweb/issues">
    <img src="https://img.shields.io/github/issues/lite-us/liteweb.svg">
  </a>

  <a href="https://github.com/lite-us/liteweb/pulls">
    <img src="https://img.shields.io/github/issues-pr/lite-us/liteweb.svg">
  </a>

  <a href="https://github.com/lite-us/liteweb/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/lite-us/liteweb.svg">
  </a>

  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/lite-us/liteweb.svg">
  </a>
</p>

## What is LiteWeb?

__[Lite Web - Developer Document](https://developers.lite.network/docs/liteweb-intro)__

LiteWeb aims to deliver a unified, seamless development experience influenced by Ethereum's [Web3](https://github.com/ethereum/web3.js/) implementation. We have taken the core ideas and expanded upon it to unlock the functionality of LITE's unique feature set along with offering new tools for integrating DApps in the browser, Node.js and IoT devices.

## Compatibility
- Version built for Node.js v6 and above
- Version built for browsers with more than 0.25% market share

You can access either version specifically from the [dist](dist) folder.

LiteWeb is also compatible with frontend frameworks such as:
- Angular
- React
- Vue.

You can also ship LiteWeb in a Chrome extension.

## Installation

### Node.js
```bash
npm install liteweb
```
or
```bash
yarn add liteweb
```

### Browser
First, don't use the release section of this repo, it has not updated in a long time.

Then easiest way to use LiteWeb in a browser is to install it as above and copy the dist file to your working folder. For example:
```
cp node_modules/liteweb/dist/LiteWeb.js ./js/liteweb.js
```
so that you can call it in your HTML page as
```
<script src="./js/liteweb.js"><script>
```

## Testnet

Shasta is the official Lite testnet. To use it use the following endpoint:
```
https://api.shasta.litegrid.io
```
Get some Shasta XLT at https://www.litegrid.io/shasta and play with it.
Anything you do should be explorable on https://shasta.litescan.org

## Your local private network for heavy testing

You can set up your own private network, running Lite Quickstart. To do it you must [install Docker](https://docs.docker.com/install/) and, when ready, run a command like

```bash
docker run -it --rm \
  -p 9090:9090 \
  -e "defaultBalance=100000" \
  -e "showQueryString=true" \
  -e "showBody=true" \
  -e "formatJson=true" \
  --name lite \
  litetools/quickstart
```

[More details about Lite Quickstart on GitHub](https://github.com/lite-us/docker-lite-quickstart)

## Creating an Instance

First off, in your javascript file, define LiteWeb:

```js
const LiteWeb = require('liteweb')
```

When you instantiate LiteWeb you can define

* fullNode
* solidityNode
* eventServer
* privateKey

you can also set a

* fullHost

which works as a jolly. If you do so, though, the more precise specification has priority.
Supposing you are using a server which provides everything, like LiteGrid, you can instantiate LiteWeb as:

```js
const liteWeb = new LiteWeb({
    fullHost: 'https://api.litegrid.io',
    privateKey: 'your private key'
})
```

For retro-compatibility, though, you can continue to use the old approach, where any parameter is passed separately:
```js
const liteWeb = new LiteWeb(fullNode, solidityNode, eventServer, privateKey)

```

If you are, for example, using a server as full and solidity node, and another server for the events, you can set it as:

```js
const liteWeb = new LiteWeb({
    fullHost: 'https://api.litegrid.io',
    eventServer: 'https://api.someotherevent.io',
    privateKey: 'your private key'
  }
)
```

If you are using different servers for anything, you can do
```js
const liteWeb = new LiteWeb({
    fullNode: 'https://some-node.tld',
    solidityNode: 'https://some-other-node.tld'
    eventServer: 'https://some-event-server.tld',
    privateKey: 'your private key'
  }
)
```

## A full example

The better way to understand how to work with Lite is to clone the [MetaCoin example](https://github.com/Litebox-boxes/metacoin-box) and follow the instructions at
https://github.com/Litebox-boxes/metacoin-box

## Contributions

In order to contribute you can

* fork this repo and clone it locally
* install the dependencies — `npm i`
* do your changes to the code
* build the LiteWeb dist files — `npm run build`
* run a local private network using Lite Quickstart
* run the tests — `npm test:node`
* push your changes and open a pull request

## Recent History
__2.7.4__
* Fix bugs of xlt.getBrokerage and xlt.getReward function

__2.7.3__
* Support new apis related to Java-Lite 3.6.5
* Original withdrawBlockRewards method support to withdraw user's reward

__2.6.8__
* Support extension of transaction expiration
* Allow to add data to the transaction
* Many minor changes and fixes

__2.6.3__
* Support get unconfirmed transaction function

__2.6.0__
* Support trigger constant contract, clear abi and add account by id
* Add permission id option in functions related to creating transaction
* Support multi-sign without permission id

__2.5.6__
* Reverse PR #6

__2.5.5__
* Ignore `receiverAddress` during `freezeBalance` and `unfreezeBalance` if it is equal to the owner address

__2.5.4__
* Adds cache in Xlt to cache Contracts locally and make the process more efficient

__2.5.2__
* Adds static methods `Xlt.signString` and `Xlt.verifySignature

__2.5.0__
* Allows freeBandwidth, freeBandwidthLimit, frozenAmount and frozenDuration to be zero

__2.3.7__
* Get rid of jssha to reduce the size of the package a little bit.

__2.3.6__
* Supports `/wallet/getapprovedlist` and `/wallet/getsignweight` JavaLite API.
* Adds test for multi-sign workflow.

__2.3.5__
* Fixes a typo in `#event.getEventsByContractAddress` naming.

__2.3.4__
* Adds options to `#plugin.register` to pass parameters to `pluginInterface`.

__2.3.3__
* Adds filters during event watching.

__2.3.2__
* Removes mixed approach instantiating liteWeb. Before you could pass the servers as an object, and the privateKey as a separate parameter. Now, you pass them either in the options object or in the params.

__2.3.1__
* Adds support for not-tld domain, like http://localhost
* Improve the new format, allow passing the privateKey as a property in the option object

__2.3.0__
* Introduces new format to instantiate liteWeb, passing an options object instead that `fullNode`, `solidityNode` and `eventServer` as separate params
* Fixes bug in `_watch` which causes a continuous update of the `since` parameter

## Licence

LiteWeb is distributed under a MIT licence.


-----

For more historic data, check the original repo at
[https://github.com/liteprotocol/lite-web](https://github.com/liteprotocol/lite-web)
