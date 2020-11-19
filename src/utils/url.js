const getUrls = {
  getProductList: (path, rowIndex, pageSize) =>
    `/mock/products/${path}.json?rowIndex=${rowIndex}&pageIsze=${pageSize}`,
  getProductDetail: (id) => `/mock/product_detail/${id}.json`,
  getShopById: (id) => `/mock/shops/${id}.json`,
  getPopularKeywords: () => `/mock/keywords/popular.json`,
  getRelatedKeywords: (keyword) => `/mock/keywords/related.json?keyword=${keyword}`,
  getRelatedShops: (keywordId) => `/mock/shops/related.json?keyword=${keywordId}`,
  getOrders: () => `/mock/orders/orders.json`,
};

export default getUrls;
