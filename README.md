# ipfs-deploy

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![](https://img.shields.io/github/workflow/status/ipfs-shipyard/ipfs-deploy/Node.js%20CI/master?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-deploy/actions/workflows/ci.yaml)

> Upload static website to IPFS pinning services and optionally update DNS.

<p align="center">
  <img src="https://user-images.githubusercontent.com/5447088/62481739-220bcc80-b7ab-11e9-8a9e-25f23ed92768.gif">
</p>

The goal of `ipfs-deploy` is to make it as easy as possible to
**deploy a static website to IPFS.**

## Table of Contents

1. [Install](#Install)
    1. [No install](#No-install)
2. [Usage](#Usage)
    1. [Supported Pinning Services](#supported-pinning-services)
    2. [Supported DNS Services](#supported-dns-providers)
3. [API](#API)
4. [Security](#Security)
5. [Contributing](#Contributing)
    1. [Contributors](#Contributors)
    2. [Add a Pinning Service](#add-a-pinning-service)
    3. [Add a DNS Provider](#add-a-dns-provider)
6. [Users](#Users)
7. [License](#License)

## Install

```bash
npm install -g ipfs-deploy
```

Or

```bash
yarn global add ipfs-deploy
```

You can call it either as `ipd` or as `ipfs-deploy`:

```bash
ipd public/
ipfs-deploy public/
```

### No install

You can run it directly with [npx](https://www.npmjs.com/package/npx 'npx')
without needing to install anything:

```bash
npx ipfs-deploy _site
```

It will deploy to a public pinning service and give you a link to
`ipfs.io/ipfs/your-hash` so you can check it out.

## Usage

You can get started just by typing out `ipd` and it will have smart defaults.
By default, it deploys to Infura, which doesn't need signup and you'll get a
link like `ipfs.io/ipfs/QmHash` that you can use to see if everything went ok.

When you don't specify a path argument to deploy, `ipfs-deploy` tries to
guess it for you based on the build directories used by the most popular static
site generators by the following order:

| Path            | Static generators                       |
| --------        | ---------------------------------       |
| `_site`         | jekyll, hakyll, eleventy                |
| `site`          | some others                             |
| `public`        | gatsby, hugo, hexo                      |
| `dist`          | nuxt                                    |
| `output`        | pelican                                 |
| `build`         | create-react-app, metalsmith, middleman |
| `website/build` | docusaurus                              |
| `docs`          | many others                             |

Some pinning services and DNS providers require signup and additional
environment variables to be set. We support and use `.env` files. Read
the section bellow to find out about which services are supported and
how to enable them.

For further information about the CLI, please run `ipfs-deploy --help`.

### Supported Pinning Services

Some things to keep in mind:

-  Please note the `__` (double underscore) between some words (such as
after `PINATA` and `CLOUDFLARE`).
-  **Don't** commit the `.env` file to source control unless you know what
you're doing.

These services are subject to their terms. Not a decentralization nirvana
by any stretch of the imagination, but a nice way to get started quickly with a
blog, static website, or frontend web app.

#### [Infura](https://infura.io)

Infura is a freemium pinning service that doesn't require any additional setup.
It's the default one used. Please bear in mind that Infura is a free service,
so there is probably a rate-limiting.

##### How to enable

Use flag `-p infura`.

#### [Pinata](https://pinata.cloud)

Pinata is another freemium pinning service. It gives you more control over
what's uploaded. You can delete, label and add custom metadata. This service
requires signup.

##### Environment variables

```bash
IPFS_DEPLOY_PINATA__API_KEY=<api key>
IPFS_DEPLOY_PINATA__SECRET_API_KEY=<secret api key>
```

##### How to enable

Use flag `-p pinata`.

#### [Fission](https://fission.codes)

Fission is a backend-as-a-service that uses IPFS and supports pinning. This service requires signup.

##### Environment variables

```bash
IPFS_DEPLOY_FISSION__USERNAME=<username>
IPFS_DEPLOY_FISSION__PASSWORD=<password>
```

##### How to enable

Use flag `-p fission`.

#### [IPFS Cluster](https://cluster.ipfs.io/)

You can use IPFS Cluster to pin your website. It can be either self-hosted or
just any IPFS Cluster you want.

##### Environment variables

```bash
IPFS_DEPLOY_IPFS_CLUSTER__HOST=<multiaddr>
IPFS_DEPLOY_IPFS_CLUSTER__USERNAME=<basic auth username>
IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD=<basic auth password>
```

##### How to enable

Use flag `-p ipfs-cluster`.

#### [DAppNode](https://dappnode.io)

DAppNode is not a centralized IPFS provider. It is an operation system that
allows you to effortless host a number of decentralized apps on your own hardware.
Default installation of DAppNode includes an IPFS node, available via VPN at `ipfs.dappnode`. 
If you can't reach the node make sure that you are connected to your DAppNode VPN.

##### How to enable

Use flag `-p dappnode`.

### Supported DNS Providers

#### [Cloudflare DNS](https://cloudflare.com)

Cloudflare is a freemium DNS provider. Supports CNAME flattening for
naked domains and integrates with their IPFS gateway at
[cloudflare-ipfs.com](https://cloudflare-ipfs.com).

Bear in mind that Cloudflare IPFS doesn't host the content itself
(it's a cached gateway), so a stable pinning service is needed if you
don't want to rely on your computer's IPFS daemon's availability to
serve your website.

In order to use a Cloudflare API token you need to grant zone read and
dns edit permissions (both under the zone section). You also need to not
restrict the zone resources to a specific zone. (This is because the list
zones API call doesn't work if you only allow access to a specific zone
and that is needed to look up the id of the zone you specify.)

##### Environment variables

```bash
# credentials
IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=
IPFS_DEPLOY_CLOUDFLARE__API_KEY=
# or...
IPFS_DEPLOY_CLOUDFLARE__API_TOKEN=

# dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=
IPFS_DEPLOY_CLOUDFLARE__RECORD=
```

Example with top-level domain:

```bash
# cloudflare dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# cloudflare dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.mysubdomain.agentofuser.com
```

##### How to enable

Use flag `-d cloudflare`.

#### [DNSimple](https://dnsimple.com)

DNSimple is a paid-for DNS provider. They have no specific IPFS support,
but allow the setting of DNS TXT records which underlies [IPFS DNSLink](https://docs.ipfs.io/guides/concepts/dnslink/).

##### Environment variables

```bash
# credentials
IPFS_DEPLOY_DNSIMPLE__TOKEN=

# dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=
IPFS_DEPLOY_DNSIMPLE__RECORD=
```

Example with top-level domain:

```bash
# dnsimple dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=agentofuser.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# dnsimple dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=agentofuser.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.mysubdomain.agentofuser.com
```

##### How to enable

Use flag `-d dnsimple`.

#### [DreamHost](https://dreamhost.com)

DreamHost is a paid-for web host. They have no specific IPFS support, but provide DNS services with API control. [DreamHost API](https://help.dreamhost.com/hc/en-us/sections/203903178-API-Application-Programming-Interface-).

##### Environment variables

```bash
# credentials
IPFS_DEPLOY_DREAMHOST__KEY=

# dns info
IPFS_DEPLOY_DREAMHOST__RECORD=
```

Example with top-level domain:

```bash
# dreamhost dns info
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# dreamhost dns info
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.mysubdomain.agentofuser.com
```

##### How to enable

Use flag `-d dreamhost`.

## API

This is still pretty unstable and subject to change, so I will just show how
the executable currently uses the API.

```javascript
const deploy = require('ipfs-deploy')

;(async () => {
  try {
    const deployOptions = {
      publicDirPath: argv.path,
      copyHttpGatewayUrlToClipboard:
        !(argv.clipboard === false) && !argv.C && !argv.noClipboard,
      open: !(argv.open === false) && !argv.O && !argv.noOpen,
      remotePinners: argv.pinner,
      dnsProviders: argv.dns,
      siteDomain: argv.siteDomain,
      credentials: {
        cloudflare: {
          apiKey: argv.cloudflare && argv.cloudflare.apiKey,
          apiToken: argv.cloudflare && argv.cloudflare.apiToken,
          apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
          zone: argv.cloudflare && argv.cloudflare.zone,
          record: argv.cloudflare && argv.cloudflare.record,
        },
        dnsimple: {
          token: argv.dnsimple && argv.dnsimple.token,
          zone: argv.dnsimple && argv.dnsimple.zone,
          record: argv.dnsimple && argv.dnsimple.record
        },
        pinata: {
          apiKey: argv.pinata && argv.pinata.apiKey,
          secretApiKey: argv.pinata && argv.pinata.secretApiKey,
        },
        fission: {
          username: argv.fission && argv.fission.username,
          password: argv.fission && argv.fission.password,
        },
        ipfsCluster: {
          host: argv.ipfsCluster && argv.ipfsCluster.host,
          username: argv.ipfsCluster && argv.ipfsCluster.username,
          password: argv.ipfsCluster && argv.ipfsCluster.password,
        },
      },
    }

    deploy(deployOptions)
  } catch (e) {}
})()
```

## Security

We use `dotenv` to handle credentials. Don't commit your `.env` file to source
control.

## Contributing

Please check [docs/contributing.md](docs/contributing.md) for further information!

## Users

- [agentofuser.com](https://agentofuser.com)
- [jaack.me](https://ipfs.jaack.me)
- [kevincox.ca](https://kevincox.ca)
- _Your website here_

If you use this package to deploy your website, please send a pull request so I
can add it to the [Users](#users) section in the README. (I reserve the right
to exercise discretion.)

## License

[BlueOak-1.0.0 OR BSD-2-Clause-Patent OR MIT © Agent of User](./LICENSE.md)

(The first two are the most permissive possible ever, more than MIT, which
doesn't have a patent waiver. Use whichever satisfies your lawyer better.)
