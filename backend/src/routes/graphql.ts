import { Router } from "express";
import { proxyGraphQL } from "../controllers/graphqlController";

const router = Router();

router.post("/graphql", proxyGraphQL);

export default router;
