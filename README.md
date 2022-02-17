
# ZUMI API

This is a deployment repo for Kalio Sobomabo technical assesment. This is the application backend, and the frontend is located at https://github.com/sobomabo/zumi_app.
## API Reference

#### Get all orders

```http
  GET /api/orders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `vendor` | `string` | **Required**. Order venbor ID |
| `search` | `string` | **Optional**. Search string |
| `orderNumber` | `string` | **Optional**. Order number |
| `customerName` | `string` | **Optional**. Order customer name |
| `status` | `string` | **Optional**. Order status |
| `page` | `number` | **Optional**. Pagination request page, default is 0 |
| `limit` | `number` | **Optional**. Pagination page limit, default is 6 |

#### Get Order

```http
  GET /api/orders/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of order to fetch |

#### Updatae Order

```http
  POST /api/orders/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of order to update |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `customerName`      | `string` | **Optional**. Order customer name |
| `customerAddress`      | `string` | **Optional**. Order customer address |
| `deliveryDate`      | `string` | **Optional**. Confirmed ordeer delivery date |
| `status`      | `string` | **Optional**. Order status |
| `cancelReason`      | `string` | **Optional**. Reason for order cancelation |
| `vendor`      | `string` | **Required**. Order venbor ID |

#### Create Order

```http
  POST /api/orders
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `customerName`      | `string` | **Optional**. Order customer name |
| `customerAddress`      | `string` | **Optional**. Order customer address |
| `deliveryDate`      | `string` | **Optional**. Confirmed ordeer delivery date |
| `status`      | `string` | **Optional**. Order status |
| `cancelReason`      | `string` | **Optional**. Reason for order cancelation |
| `vendor`      | `string` | **Required**. Order venbor ID |
| `orderLines`      | `array` | **Required**. List of objects representing order products {sku: string, name: string, quantity: number, price: number} |

#### List Products

```http
  GET /api/products
```

| Parameters | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sku`      | `string` | **Optional**. Product number |
| `name`      | `string` | **Optional**. Product name |
| `brand`      | `string` | **Optional**. Product brand name |
| `price`      | `string` | **Optional**. Product brand |
| `quantity`      | `string` | **Optional**. Product quantity |
| `vendor`      | `string` | **Required**. Product vendor ID |
| `search`      | `string` | **Required**. Search steing |
| `status`      | `string` | **Required**. Product status |
| `page` | `number` | **Optional**. Pagination request page, default is 0 |
| `limit` | `number` | **Optional**. Pagination page limit, default is 6 |

#### Get Product

```http
  GET /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of product to fetch |

#### Update Product

```http
  POST /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of product to update |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Optional**. Product name |
| `brand`      | `string` | **Optional**. Product brand name |
| `price`      | `string` | **Optional**. Product brand |
| `quantity`      | `string` | **Optional**. Product quantity |
| `vendor`      | `string` | **Required**. Vendor ID of product |

#### Create Product

```http
  POST /api/products
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sku`      | `string` | **Required**. Product number |
| `name`      | `string` | **Required**. Product name |
| `brand`      | `string` | **Required**. Product brand name |
| `price`      | `string` | **Required**. Product brand |
| `quantity`      | `string` | **Required**. Product quantity |
| `vendor`      | `string` | **Required**. Vendor ID of product |

#### Create User

```http
  POST /api/users/
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName`      | `string` | **Required**. First name of the user |
| `lastname`      | `string` | **Required**. Last name of the user |
| `username`      | `string` | **Required**. Username of the user |
| `password`      | `string` | **Required**. password of the user |

#### Login User

```http
  POST /api/orders/login
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username of the user |
| `password`      | `string` | **Required**. password of the user |



## Deployment

To deploy the API locally please follow the steps below:

```bash
  git clone https://github.com/sobomabo/zumi_api.git
```
A **zumi_api** directory will be created.

Change into the zumi_api directory, and run the command below:

```bash
  npm install
```
To install all the API depencencies

```bash
  npm run staging
```
This is will spin up an instance of the API ready to receive requests, The API is exposed on port 3001.

Run the command bellow to seed the database with dummy data, a list of users (vendors) with their passwords will be print in the console for test.

```bash
  node seedDB.js
```