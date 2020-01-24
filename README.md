# Boilerplate Aepp Vue.JS Frontend

This boilerplate is designed to allow everyone an easy start when building an aepp on 
top of the aeternity eco system. It contains three critical parts:
- A custom build pipeline
- Easy wallet discovery
- The [aeternity js-sdk](https://github.com/aeternity/aepp-sdk-js)
- Already styled components (see [aepp-components](https://github.com/aeternity/aepp-components))

## Get started

Clone repo via git or use the template button above.

Install the dependencies
```
npm install
```

For development purposes (hot-reloading)
```
npm run dev
```

To build the bundle for production
```
npm run build
```

For running the integration tests
```
npm run test
```

## Main Features

#### Custom build pipeline
We engineered this pipeline config to be as versatile as possible while still being
completely transparent to the developer as there are no hidden config files and a minimal
set of presets where necessary.

`webpack.\*.js`: Most of the configuration can be found in `webpack.common.js`. This file will be then, based on the
npm command you run, be merged with the respective additional webpack config file. The dev file adds the dev server options
and skips the postcss css usage based purging of classes. The prod file adds the purging back in and can be used to
further optimize the build. The test file allows the private and public key to be inserted in the wallet search file,
which in turn enables testing without an external wallet provider.

We also have a non active branch where the custom build pipeline is replaced with a preconfigured vue-cli version. We decided
against this due to the intransparency of the vue-cli presets and no performance or size improvements compared to the 
custom pipeline.

#### Easy wallet discovery

The file `src/utils/aeternity.js` provides a sample implementation of a wallet discovery mechanism. This file should
be reviewed by every developer for security reasons but should work as is. It will try to find the 
[base-aepp](https://github.com/aeternity/aepp-base) first, if the application is loaded in an iframe. Otherwise it will
mount the [base-aepp](https://github.com/aeternity/aepp-base) as an iframe. Finally it will initialize a client without
keypair that allows for static calls to be made. If a wallet is loaded and with which priority should be configured in 
this file. We will update this file in the future as new wallets appear. 

[AEX-2](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-2.md) is an extension proposal to standardize the wallet to
aepp communication. As of this writing it has been withdrawn but is still the reference implementation provided by the js-sdk.
Since we aim to make this boilerplate as universally connective as possible, we also implemented the client side protocol
for this standard in the file `src/utils/walletSearch.js`. It is up to the developer to decide if it should be activated and used.
To active simply use call the `init()` function in `App.vue`. Currently only either the wallet discovery provided in `aeternity.js`
or the wallet discovery from `walletSearch.js` can be active. This might be changed in the future or if a new standard emerges.

#### SDK and aepp-components integration

Both of these packages are imported and should work out of the box with this implementation. An initialized client is
provided by the `aeternity.js` file described earlier at `aeternity.client`, if a wallet has been discovered. The
aepp-components should be similarly easy to use by just importing the required components and using them in
your html. An example can be found in `src/views/Home.vue`.
