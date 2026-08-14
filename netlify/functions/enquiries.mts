import type { Config, Context } from "@netlify/functions";
import { eq, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { enquiries } from "../../db/schema.js";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function formatEnquiry(item: typeof enquiries.$inferSelect) {
  return {
    id: item.id,
    _id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone,
    message: item.message,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/\/+$/, ""); // strip trailing slash
  const method = req.method.toUpperCase();

  try {
    // Health / info check
    if (pathname === "/api/website/enquiry" && method === "GET") {
      // Check if caller wants JSON API info or list
      const all = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      return jsonResponse({
        status: 1,
        msg: "Enquiries fetched successfully",
        data: all.map(formatEnquiry),
      });
    }

    // READ / GET all
    if (pathname === "/api/website/enquiry/read" && method === "GET") {
      const all = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      return jsonResponse({
        status: 1,
        msg: "Enquiries fetched successfully",
        data: all.map(formatEnquiry),
      });
    }

    // INSERT / POST
    if ((pathname === "/api/website/enquiry/insert" || pathname === "/api/website/enquiry") && method === "POST") {
      let body: any;
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ status: 0, msg: "Invalid JSON body" }, 400);
      }

      const { name, email, phone, message } = body;
      if (!name || !email || !phone || !message) {
        return jsonResponse({ status: 0, msg: "All fields are required" }, 400);
      }

      const [saved] = await db
        .insert(enquiries)
        .values({
          name: String(name).trim(),
          email: String(email).trim().toLowerCase(),
          phone: String(phone).trim(),
          message: String(message).trim(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return jsonResponse(
        {
          status: 1,
          msg: "Enquiry Saved Successfully",
          data: formatEnquiry(saved),
        },
        201
      );
    }

    // VIEW / GET single by ID: /api/website/enquiry/view/:id or /api/website/enquiry/:id
    const viewMatch = pathname.match(/^\/api\/website\/enquiry\/(?:view\/)?(\d+)$/);
    if (viewMatch && method === "GET") {
      const id = parseInt(viewMatch[1], 10);
      const [item] = await db.select().from(enquiries).where(eq(enquiries.id, id));

      if (!item) {
        return jsonResponse({ status: 0, msg: "Enquiry not found" }, 404);
      }

      return jsonResponse({
        status: 1,
        msg: "Enquiry fetched successfully",
        data: formatEnquiry(item),
      });
    }

    // UPDATE / PUT / PATCH by ID: /api/website/enquiry/update/:id or /api/website/enquiry/:id
    const updateMatch = pathname.match(/^\/api\/website\/enquiry\/(?:update\/)?(\d+)$/);
    if (updateMatch && (method === "PUT" || method === "PATCH")) {
      const id = parseInt(updateMatch[1], 10);

      let body: any;
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ status: 0, msg: "Invalid JSON body" }, 400);
      }

      const { name, email, phone, message } = body;
      if (!name || !email || !phone || !message) {
        return jsonResponse({ status: 0, msg: "All fields are required" }, 400);
      }

      const [updated] = await db
        .update(enquiries)
        .set({
          name: String(name).trim(),
          email: String(email).trim().toLowerCase(),
          phone: String(phone).trim(),
          message: String(message).trim(),
          updatedAt: new Date(),
        })
        .where(eq(enquiries.id, id))
        .returning();

      if (!updated) {
        return jsonResponse({ status: 0, msg: "Enquiry not found" }, 404);
      }

      return jsonResponse({
        status: 1,
        msg: "Enquiry Updated Successfully",
        data: formatEnquiry(updated),
      });
    }

    // DELETE / DELETE by ID: /api/website/enquiry/delete/:id or /api/website/enquiry/:id
    const deleteMatch = pathname.match(/^\/api\/website\/enquiry\/(?:delete\/)?(\d+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = parseInt(deleteMatch[1], 10);

      const [deleted] = await db
        .delete(enquiries)
        .where(eq(enquiries.id, id))
        .returning();

      if (!deleted) {
        return jsonResponse({ status: 0, msg: "Enquiry not found" }, 404);
      }

      return jsonResponse({
        status: 1,
        msg: "Enquiry Deleted Successfully",
      });
    }

    return jsonResponse({ status: 0, msg: "Route not found" }, 404);
  } catch (error: any) {
    console.error("Enquiry function error:", error);
    return jsonResponse(
      {
        status: 0,
        msg: error?.message || "Internal server error",
      },
      500
    );
  }
};

export const config: Config = {
  path: [
    "/api/website/enquiry",
    "/api/website/enquiry/*",
    "/api/website/enquiry/view/*",
    "/api/website/enquiry/update/*",
    "/api/website/enquiry/delete/*",
  ],
};
