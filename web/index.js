// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import fetchCollection, { fetchHooks } from "./helpers/index.js";
import { DeliveryMethod } from "@shopify/shopify-api";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

//-------------------------------------------------------
// Get Order
app.get("/api/orders", async (_req, res) => {
  try {
    const response = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: "any",
      limit: 1,
    });

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Change Tags on Order
app.put("/api/orders/", async (_req, res) => {
  try {
    const order = new shopify.api.rest.Order({
      session: res.locals.shopify.session,
    });
    order.id = _req.body.id;
    order.tags = "cancelled";
    await order.save({
      update: true,
    });
    console.log(order);
  } catch (err) {
    console.log(err);
  }
});

// Cancel First order

app.post("/api/orders/", async (_req, res) => {
  try {
    const order = new shopify.api.rest.Order({
      session: res.locals.shopify.session,
    });
    order.id = _req.body.id;
    await order.cancel({});
    console.log(order);
  } catch (err) {
    console.log(err);
  }
});

//Change Tags on Order
app.post("/api/orders/", async (_req, res) => {
  try {
    const order = new shopify.api.rest.Order({
      session: res.locals.shopify.session,
    });
    order.id = 5268664942875;
    order.tags = "cancelled";
    await order.save({
      update: true,
    });
    console.log(order);
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------
app.post("/api/orders/create", async (_req, res) => {
  console.log("@@@@@@@@@@@@@@@@@@", _req?.body?.address1);
  let status = 200;
  let error = null;
  try {
    const order = new shopify.api.rest.Order({
      session: res.locals.shopify.session,
    });
    order.line_items = [
      {
        variant_id: _req?.body?.variant_id,
        quantity: _req?.body?.quantity,
      },
    ];
    order.customer = {
      id: _req?.body?.customer_id,
    };
    order.shipping_address = {
      first_name: _req?.body?.first_name,
      last_name: _req?.body?.last_name,
      address1: _req?.body?.address1,
      phone: _req?.body?.phone,
      city: _req?.body?.city,
      province: _req?.body?.province,
      country: _req?.body?.country,
      zip: _req?.body?.zip,
    };
    // order.shipping_address = {
    //   address1: _req?.body?.address1,
    //   city: " ",
    //   province: _req?.body?.province ? _req?.body?.province : " ",
    //   country: _req?.body?.country ? _req?.body?.country : " ",
    //   zip: " ",
    //   phone: _req?.body?.phone,
    //   first_name: " ",
    //   last_name: " ",
    //   country_code: _req?.body?.country_code ? _req?.body?.country_code : " ",
    //   province_code: _req?.body?.province_code
    //     ? _req?.body?.province_code
    //     : " ",
    // };
    order.currency = "EUR";
    await order.save({
      update: true,
    });
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//-------------------------------------------------------------

// Update Order
app.put("/api/orders/update", async (_req, res) => {
  console.log("@@@@@@@@@@@@@@@@@@", _req.body);
  let status = 200;
  let error = null;

  try {
    const order = new shopify.api.rest.Order({
      session: res.locals.shopify.session,
    });
    order.id = 5273656754459;
    order.shipping_address = {
      address1: "Road No 1, House 1, Khulna, Bangladesh",
      city: "Khulna",
      province: "Khulna",
      country: "Bangladesh",
      zip: "9000",
      phone: "01700000000",
      first_name: "Naim",
      last_name: "Hossain",
    };
    await order.save({
      update: true,
    });
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});
//-------------------------------------------------------------

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
