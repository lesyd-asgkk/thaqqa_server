import { Router } from "../deps.ts";
//import { TodoController } from "./controller.ts";

const router = new Router();
//const todoController = TodoController();

router.get("/server/:id", (ctx) => {
  new Response(`${ctx}にはアクセスできません`, { status: 403 });
});

export default router;
