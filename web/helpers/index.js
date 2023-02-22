import express from "express";
const app = express();

export const fetchHooks = async (ctx) => {
  console.log("fetchHooks", ctx);
  app.get("/api/test", async (_req, res) => {
    console.log("yaaaaaaaaaaaaaaa", ctx);
    res.status(200).send(ctx);
  });
};

export default async function fetchCollection(session) {
  try {
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: `query {
        collection(id: "gid://shopify/Collection/290987770010") {
        id
        title
        handle
        updatedAt
        productsCount
      }
    }`,
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
