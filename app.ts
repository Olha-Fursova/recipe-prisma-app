import express from "express";
import type { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import prisma from "./prisma/client.ts";

import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectSqlite3 from "connect-sqlite3";

import recipesRoutes from "./src/routes/recipes.routes.ts";
import categoriesRoutes from "./src/routes/categories.routes.ts";
import tagsRoutes from "./src/routes/tags.routes.ts";
import reviewsRoutes from "./src/routes/reviews.routes.ts";
import { generateOpenApiDocument } from "./src/openapi.ts";

// ===================
// Module augmentation

declare module "express-session" {
  interface SessionData {
    userId: number;
    username: string;
  }
}

type SQLiteStoreConstructor = new (options: {
  db: string;
  dir: string;
}) => session.Store;

const SQLiteStore = connectSqlite3(
  session,
) as unknown as SQLiteStoreConstructor;

// ===================

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new SQLiteStore({ db: "dev.db", dir: "." }),
    secret: process.env.SESSION_SECRET!,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/recipes", recipesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api", reviewsRoutes);

// ================
// Authentification

type AuthFormBody = {
  username?: string;
  password?: string;
};

app.get("/register", (_req: Request, res: Response) => {
  res.render("register", { error: null, data: null });
});

app.post(
  "/register",
  async (req: Request<{}, {}, AuthFormBody>, res: Response) => {
    const { username, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.render("register", {
        error: "Username has to be more than 3 symbols",
        data: req.body,
      });
    }

    if (!password || password.length < 6) {
      return res.render("register", {
        error: "Password has to be at least 6 characters long",
        data: req.body,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser) {
      return res.render("register", {
        error: "User with this username already exists",
        data: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
      },
    });

    res.redirect("/login");
  },
);

// ================

// ================
// Register



// ================

// 404 Not Found handler - must be after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Validation failed",
      details: {
        body: ["Invalid JSON format in request body"],
      },
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Unique constraint violation" });
  }

  if (err.code === "P2003") {
    return res.status(400).json({ error: "Foreign key constraint failed" });
  }

  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
