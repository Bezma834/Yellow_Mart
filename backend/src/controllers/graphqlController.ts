import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  parse,
  visit,
  FieldNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  SelectionSetNode,
  ValueNode,
  Kind,
  DocumentNode,
} from "graphql";
import pool from "../db/db";

// =====================================================================
// GraphQL proxy gateway
//
// Hasura itself has NO role permissions configured (only the admin
// secret works), so this proxy is the authorization boundary:
//
//  - ANONYMOUS  -> public read roots + pre-auth action mutations only
//  - AUTHENTICATED -> user-facing roots + user data mutations only
//  - admin table operations are REJECTED here (the admin dashboard uses
//    the REST /api/admin API instead)
//
// The x-hasura-role header is deliberately NOT forwarded: Hasura has no
// per-role permissions, so a "user" role header would break legitimate
// queries. The allowlist below is the gate.
// =====================================================================

const PUBLIC_QUERY_ROOTS = new Set([
  "businesses",
  "businesses_by_pk",
  "categories",
]);

const PUBLIC_MUTATION_ROOTS = new Set([
  "login",
  "google_login",
  "signup",
  "checkEmail",
  "forgotPassword",
  "resetPassword",
]);

const AUTH_QUERY_ROOTS = new Set([
  ...PUBLIC_QUERY_ROOTS,
  "favorites",
  "users_by_pk",
]);

const AUTH_MUTATION_ROOTS = new Set([
  ...PUBLIC_MUTATION_ROOTS,
  "changePassword",
  "deleteAccount",
  "insert_businesses_one",
  "update_businesses_by_pk",
  "delete_businesses_by_pk",
  "insert_favorites_one",
  "delete_favorites",
  "update_users_by_pk",
]);

// Columns nobody may touch through the proxy (admin-only concerns):
const FORBIDDEN_USER_SET_KEYS = ["role", "password", "email", "email_verified"];
const FORBIDDEN_BUSINESS_SET_KEYS = ["status", "featured"];

type Variables = Record<string, unknown>;

const resolveValue = (node: ValueNode, variables: Variables): unknown => {
  switch (node.kind) {
    case Kind.VARIABLE:
      return variables[node.name.value];
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.ENUM:
      return (node as any).value;
    case Kind.NULL:
      return null;
    case Kind.LIST:
      return node.values.map((v) => resolveValue(v, variables));
    case Kind.OBJECT: {
      const out: Record<string, unknown> = {};
      for (const f of node.fields) {
        out[f.name.value] = resolveValue(f.value, variables);
      }
      return out;
    }
    default:
      return undefined;
  }
};

const argValue = (
  field: FieldNode,
  name: string,
  variables: Variables
): unknown => {
  const arg = field.arguments?.find((a) => a.name.value === name);
  return arg ? resolveValue(arg.value, variables) : undefined;
};

const asRecord = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

const collectRoots = (
  op: OperationDefinitionNode,
  frags: Map<string, FragmentDefinitionNode>
): string[] => {
  const roots: string[] = [];
  const walk = (sel: SelectionSetNode) => {
    for (const s of sel.selections) {
      if (s.kind === "Field") {
        roots.push(s.name.value);
      } else if (s.kind === "FragmentSpread") {
        const frag = frags.get(s.name.value);
        if (frag) walk(frag.selectionSet);
      } else if (s.kind === "InlineFragment") {
        walk(s.selectionSet);
      }
    }
  };
  walk(op.selectionSet);
  return roots;
};

const findRootField = (
  op: OperationDefinitionNode,
  frags: Map<string, FragmentDefinitionNode>,
  name: string
): FieldNode | null => {
  const find = (sel: SelectionSetNode): FieldNode | null => {
    for (const s of sel.selections) {
      if (s.kind === "Field" && s.name.value === name) return s;
      if (s.kind === "FragmentSpread") {
        const frag = frags.get(s.name.value);
        if (frag) {
          const hit = find(frag.selectionSet);
          if (hit) return hit;
        }
      } else if (s.kind === "InlineFragment") {
        const hit = find(s.selectionSet);
        if (hit) return hit;
      }
    }
    return null;
  };
  return find(op.selectionSet);
};

const isBusinessOwner = async (
  businessId: unknown,
  userId: string
): Promise<boolean> => {
  if (typeof businessId !== "string" || !businessId) return false;
  try {
    const result = await pool.query(
      `SELECT owner_id FROM businesses WHERE id = $1`,
      [businessId]
    );
    return (
      result.rows.length === 1 &&
      result.rows[0].owner_id === userId
    );
  } catch {
    // Fail closed: if we cannot verify ownership, deny.
    return false;
  }
};

const forbiddenKeys = (
  record: Record<string, unknown> | null,
  keys: string[]
): boolean => {
  if (!record) return false;
  return keys.some((k) => Object.prototype.hasOwnProperty.call(record, k));
};

// =====================================================================

export const proxyGraphQL = async (req: Request, res: Response) => {
  const { query, variables: rawVariables } = req.body || {};
  const variables: Variables = rawVariables || {};

  if (!query) {
    return res.status(400).json({ errors: [{ message: "Missing query" }] });
  }

  let doc: DocumentNode;
  try {
    doc = parse(query);
  } catch {
    return res.status(400).json({
      errors: [{ message: "Invalid GraphQL query" }],
    });
  }

  // ---- Authentication -------------------------------------------------
  let auth: { id: string; role: string } | null = null;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as any;
      if (decoded?.id) {
        auth = {
          id: String(decoded.id),
          role: String(decoded.role || ""),
        };
      }
    } catch {
      // Invalid token -> treat as anonymous; keep deny-by-default behavior.
      auth = null;
    }
  }

  // ---- Operation classification ---------------------------------------
  const operations = doc.definitions.filter(
    (d) => d.kind === "OperationDefinition"
  ) as OperationDefinitionNode[];
  const fragments = new Map<string, FragmentDefinitionNode>();
  for (const d of doc.definitions) {
    if (d.kind === "FragmentDefinition") fragments.set(d.name.value, d);
  }

  if (operations.length === 0) {
    return res.status(400).json({ errors: [{ message: "No operations found" }] });
  }

  // Global rule: the password column is never readable through the proxy.
  let passwordSelected = false;
  visit(doc, {
    Field(node: FieldNode) {
      if (node.name.value === "password") passwordSelected = true;
    },
  });
  if (passwordSelected) {
    return res.status(403).json({
      errors: [{ message: "Operation not permitted at API gateway" }],
    });
  }

  // ---- Per-operation allowlist ----------------------------------------
  for (const op of operations) {
    const isQuery = op.operation === "query";
    const allowed = isQuery
      ? auth
        ? AUTH_QUERY_ROOTS
        : PUBLIC_QUERY_ROOTS
      : auth
        ? AUTH_MUTATION_ROOTS
        : PUBLIC_MUTATION_ROOTS;

    const roots = collectRoots(op, fragments);
    for (const root of roots) {
      if (!allowed.has(root)) {
        return res.status(403).json({
          errors: [{ message: "Operation not permitted at API gateway" }],
        });
      }
    }

    // ---- Mutation argument guards --------------------------------------
    if (!isQuery && auth) {
      const guard = async () => {
        if (roots.includes("update_users_by_pk")) {
          const field = findRootField(op, fragments, "update_users_by_pk")!;
          const pk = asRecord(argValue(field, "pk_columns", variables));
          const id = pk?.id;
          if (id !== auth!.id) throw new Error("not permitted");
          const set = asRecord(argValue(field, "_set", variables));
          if (forbiddenKeys(set, FORBIDDEN_USER_SET_KEYS))
            throw new Error("not permitted");
        }

        if (roots.includes("update_businesses_by_pk")) {
          const field = findRootField(op, fragments, "update_businesses_by_pk")!;
          const pk = asRecord(argValue(field, "pk_columns", variables));
          const owned = await isBusinessOwner(pk?.id, auth!.id);
          if (!owned) throw new Error("not permitted");
          const set = asRecord(argValue(field, "_set", variables));
          if (forbiddenKeys(set, FORBIDDEN_BUSINESS_SET_KEYS))
            throw new Error("not permitted");
        }

        if (roots.includes("delete_businesses_by_pk")) {
          const field = findRootField(op, fragments, "delete_businesses_by_pk")!;
          const pk = asRecord(argValue(field, "pk_columns", variables));
          const owned = await isBusinessOwner(pk?.id, auth!.id);
          if (!owned) throw new Error("not permitted");
        }

        if (roots.includes("insert_businesses_one")) {
          const field = findRootField(op, fragments, "insert_businesses_one")!;
          const object = asRecord(argValue(field, "object", variables));
          if (!object) throw new Error("not permitted");
          if (forbiddenKeys(object, FORBIDDEN_BUSINESS_SET_KEYS))
            throw new Error("not permitted");
          const status = object.status;
          if (status !== undefined && status !== "pending")
            throw new Error("not permitted");
          if (object.owner_id !== undefined && object.owner_id !== auth!.id)
            throw new Error("not permitted");
        }

        if (roots.includes("insert_favorites_one")) {
          const field = findRootField(op, fragments, "insert_favorites_one")!;
          const object = asRecord(argValue(field, "object", variables));
          if (!object || object.user_id !== auth!.id)
            throw new Error("not permitted");
        }

        if (roots.includes("delete_favorites")) {
          const field = findRootField(op, fragments, "delete_favorites")!;
          const where = asRecord(argValue(field, "where", variables));
          if (!where) throw new Error("not permitted");
          const userIdCond = asRecord(where.user_id);
          const userIdEq = (userIdCond as any)?._eq;
          if (userIdEq !== auth!.id) throw new Error("not permitted");
        }
      };

      try {
        await guard();
      } catch {
        return res.status(403).json({
          errors: [{ message: "Operation not permitted at API gateway" }],
        });
      }
    }
  }

  // ---- Forward to Hasura ----------------------------------------------
  const headers: Record<string, string> = {
    "x-hasura-admin-secret": process.env.HASURA_SECRET || "",
  };

  if (auth?.id) {
    // Needed by Hasura Actions (changePassword/deleteAccount) to know the
    // acting user. The role header is intentionally NOT forwarded.
    headers["x-hasura-user-id"] = auth.id;
  }

  try {
    const response = await axios.post(
      process.env.HASURA_URL || "",
      { query, variables },
      { headers }
    );

    return res.status(response.status).json(response.data);
  } catch (err: any) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    return res.status(502).json({
      errors: [{ message: "GraphQL proxy failed to reach the database" }],
    });
  }
};