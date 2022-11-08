# Overview

This is a Node/Typescript app that hosts simple APIs to interact with an Ethereum node. It uses hardhat
as the infrastructure for the test node, and MongoDB as the database. It covers the following features:

- A simple "Ramp" API
- Testnet infrastructure
- A simple analytics API

# Requirements

This app has only two requirements:

- Node 18+ (_older versions of Node may work, however this is untested_)
- MongoDB 6+

# Usage

The configuration information such as _port_, _mongodb URL_, _eth node URL_ are stored in a `.env` at the root  of this project.
You will need to at least set the `MONGO_URL` value if you're not running MongoDB locally with default configurations.

To start the app, execute the following commands from the root of this project:

1. `npm install` - installs the required packages
2. `npm run node` - starts the test node infrastructure
3. `npm run dev` - starts the app, its default port is 3000
4. execute any of the API endpoints in the **REST API Endpoints** section

# REST API Endpoints

Fulfill Order - `POST /api/fulfill-order`. This confirms a user's purchase and transfers the crypto to their wallet.

Sample Request: 
```
{
    "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "cryptoUnitCount": 1.12,
    "cryptoCurrencyName": "ETH"
}
```

Sample Response - 200:
```
{
    "cryptoUnitCount": 1.12,
    "cryptoCurrencyName": "ETH",
    "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "status": "SUCCESS",
    "txHash": "0xe01f6bc5c9768849ed5ed408393faf528ab90650bd0b6f0013c6af940e05e2fa",
    "createdAt": "2022-11-08T20:24:09.788Z",
    "orderId": "636abae981f89034223c3d89"
}
```

--- 

Admin Order Volume - `GET /api/admin/highest-volumne`. This endpoint returns the wallet address with the most fulfilled orders in the last 30 days. It returns an array with only one item if there are results, or an empty array otherwise. It returns an array to simplify handling cases where there are no results.

Sample Response - 200:
```
[
    {
        "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "total": 2.24,
        "quantity": 2
    }
]
```

---

# Limitations

- There may be issues with precision because the app stores order amounts as Ether instead
of Wei. Ideally the amounts should be stored as Wei, and converted between Ether/Wei reads/writes respectively.
- The app mostly considers happy path, accompanied by a handful of unit tests.
