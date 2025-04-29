import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, ProductsResponse, Category } from "../../types/product";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      { limit?: number; skip?: number }
    >({
      query: ({ limit = 10, skip = 0 }) =>
        `products?limit=${limit}&skip=${skip}`,
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => "products/categories",
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; product: Partial<Product> }
    >({
      query: ({ id, product }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: product,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} = productApi;
