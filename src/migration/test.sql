SELECT
  "product"."id" AS "product_id", "category"."id" AS "category_id"
FROM
  "product" "product"
LEFT JOIN "product_categories_category" "product_category" ON "product_category"."productId"="product"."id"
LEFT JOIN "category" "category" ON "category"."id"="product_category"."categoryId"

WHERE "category"."id" IN (10)


SELECT
  "order"."uuid" AS "order_uuid",
  "order"."number" AS "order_number",
  "order"."status" AS "order_status"
FROM
  "order" "order"
LEFT JOIN "order_item" "orderItems" ON "orderItems"."orderId"="order"."id"
