#!/usr/bin/env node
import { main } from "../src/index.js";
main().catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
});
//# sourceMappingURL=dversum-mcp.js.map