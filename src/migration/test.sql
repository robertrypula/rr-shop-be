SELECT
  "product"."id" AS "product_id", "category"."id" AS "category_id"
FROM
  "product" "product"
LEFT JOIN "product_categories_category" "product_category" ON "product_category"."productId"="product"."id"
LEFT JOIN "category" "category" ON "category"."id"="product_category"."categoryId"

WHERE "category"."id" IN (10)
