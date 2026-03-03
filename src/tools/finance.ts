import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerFinanceTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "get_finance_overview",
    "Get the financial overview — monthly revenue vs expenses breakdown for a given year.",
    {
      year: z
        .number()
        .optional()
        .describe("Year to query (default: current year)"),
    },
    async ({ year }) => {
      const params: Record<string, string> = {};
      if (year !== undefined) params.year = String(year);
      const data = await client.get("/finanzen/overview", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_vat_summary",
    "Get the VAT pre-return (USt-Voranmeldung) summary with Kennzahlen 81, 86, 66, 83.",
    {
      year: z.number().describe("Year"),
      quarter: z
        .number()
        .optional()
        .describe("Quarter (1-4). If omitted, returns full year."),
    },
    async ({ year, quarter }) => {
      const params: Record<string, string> = { year: String(year) };
      if (quarter !== undefined) params.quarter = String(quarter);
      const data = await client.get("/finanzen/ust-summary", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_received_invoices",
    "List received invoices (Eingangsrechnungen) from suppliers.",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page"),
      status: z
        .enum(["received", "validated", "approved", "booked", "paid", "rejected"])
        .optional()
        .describe("Filter by status"),
    },
    async ({ page, per_page, status }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      if (status) params.status = status;
      const data = await client.get("/received-invoices", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_suppliers",
    "List all suppliers (Lieferanten).",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page"),
    },
    async ({ page, per_page }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      const data = await client.get("/suppliers", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
