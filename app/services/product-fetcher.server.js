import prisma from "../db.server.js";

const PRODUCTS_QUERY = `#graphql
  query FetchPconProducts($cursor: String) {
    products(first: 50, after: $cursor, query: "metafields.namespace:'$app' AND metafields.key:'pcon_article_number'") {
      edges {
        node {
          id
          title
          handle
          articleNumber: metafield(namespace: "$app", key: "pcon_article_number") {
            value
          }
          manufacturerId: metafield(namespace: "$app", key: "pcon_manufacturer_id") {
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function fetchPconProducts() {
  const offlineSession = await prisma.session.findFirst({
    where: { isOnline: false },
    orderBy: { id: "desc" },
  });

  if (!offlineSession) {
    throw new Error("No offline Shopify session found. Install the app first.");
  }

  const shop = offlineSession.shop;
  const accessToken = offlineSession.accessToken;
  const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-04";

  const articles = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables: { cursor },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors?.length) {
      throw new Error(`GraphQL error: ${errors[0].message}`);
    }

    for (const { node } of data.products.edges) {
      const articleNumber = node.articleNumber?.value;
      if (!articleNumber) continue;

      articles.push({
        articleNumber,
        manufacturerId: node.manufacturerId?.value || "",
        title: node.title,
        handle: node.handle,
        productId: node.id,
      });
    }

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return articles;
}
