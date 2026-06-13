import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("stock-list", "routes/stocklist.tsx"),
] satisfies RouteConfig;