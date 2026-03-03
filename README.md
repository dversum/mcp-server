# @dversum/mcp-server

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the **dVersum** business management API. Lets AI assistants like Claude Desktop, Cursor, and Windsurf interact with your dVersum workspace — managing clients, projects, tasks, invoices, time tracking, and more.

## Quick Start

### Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "dversum": {
      "command": "npx",
      "args": ["-y", "@dversum/mcp-server"],
      "env": {
        "DVERSUM_API_URL": "https://api.dversum.com/api/v1",
        "DVERSUM_API_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP settings:

```json
{
  "mcpServers": {
    "dversum": {
      "command": "npx",
      "args": ["-y", "@dversum/mcp-server"],
      "env": {
        "DVERSUM_API_URL": "https://api.dversum.com/api/v1",
        "DVERSUM_API_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

## Docker (Production)

### Quick start

```bash
cd mcp-server

# Create .env file
echo "DVERSUM_API_URL=https://api.dversum.com/api/v1" > .env
echo "DVERSUM_API_TOKEN=your-jwt-token" >> .env

# Run
docker compose up -d
```

The server starts on port **3100** with a health check at `/health` and the MCP endpoint at `/mcp`.

### Build & run manually

```bash
docker build -t dversum-mcp .
docker run -d \
  -p 3100:3100 \
  -e DVERSUM_API_URL=https://api.dversum.com/api/v1 \
  -e DVERSUM_API_TOKEN=your-jwt-token \
  --name dversum-mcp \
  --restart unless-stopped \
  dversum-mcp
```

### Connect remote MCP to Claude Desktop

Once the Docker container is running, point Claude Desktop to the remote endpoint:

```json
{
  "mcpServers": {
    "dversum": {
      "url": "http://your-server:3100/mcp"
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DVERSUM_API_URL` | Yes | Base URL of your dVersum API (e.g. `https://api.dversum.com/api/v1`) |
| `DVERSUM_API_TOKEN` | Yes | Your JWT authentication token |
| `MCP_TRANSPORT` | No | `stdio` (default) or `http` (for Docker/remote) |
| `MCP_PORT` | No | HTTP port when using `http` transport (default: `3100`) |

## Available Tools (53)

### Clients (CRM)
| Tool | Description |
|------|-------------|
| `list_clients` | List all clients with pagination |
| `get_client` | Get client details |
| `create_client` | Create a new client |
| `update_client` | Update client details |
| `delete_client` | Delete a client |

### Contacts
| Tool | Description |
|------|-------------|
| `list_contacts` | List all contacts |
| `get_contact` | Get contact details |
| `create_contact` | Create a new contact |

### Projects
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects |
| `get_project` | Get project details |
| `create_project` | Create a new project |
| `get_project_board` | Get full kanban board (columns + tasks) |

### Tasks
| Tool | Description |
|------|-------------|
| `get_task` | Get task details (assignees, subtasks, tags) |
| `create_task` | Create a task in a project column |
| `update_task` | Update task properties |
| `move_task` | Move task to a different column |
| `assign_task` | Add an assignee to a task |
| `list_task_comments` | List comments on a task |

### Time Tracking
| Tool | Description |
|------|-------------|
| `list_time_entries` | List time entries (filter by date, project) |
| `create_time_entry` | Log a completed time entry |
| `start_timer` | Start a running timer |
| `stop_timer` | Stop a running timer |
| `get_running_timer` | Get the currently running timer |
| `get_time_stats` | Get time tracking statistics |

### Calendar
| Tool | Description |
|------|-------------|
| `list_events` | List calendar events in a date range |
| `get_event` | Get event details |
| `create_event` | Create a calendar event |
| `update_event` | Update an event |
| `delete_event` | Delete an event |

### Invoices
| Tool | Description |
|------|-------------|
| `list_invoices` | List invoices (filter by status, client, type) |
| `get_invoice` | Get invoice with line items and totals |
| `create_invoice` | Create a draft invoice |
| `update_invoice_status` | Change invoice status |
| `send_invoice_email` | Send invoice via email |
| `create_invoice_from_time` | Create invoice from tracked time |

### Quotes
| Tool | Description |
|------|-------------|
| `list_quotes` | List quotes/proposals |
| `get_quote` | Get quote with line items |
| `create_quote` | Create a draft quote |
| `convert_quote_to_invoice` | Convert accepted quote to invoice |

### Finance
| Tool | Description |
|------|-------------|
| `get_finance_overview` | Monthly revenue vs expenses |
| `get_vat_summary` | USt-Voranmeldung (KZ 81/86/66/83) |
| `list_received_invoices` | List incoming invoices |
| `list_suppliers` | List all suppliers |

### Team Planning (Absences)
| Tool | Description |
|------|-------------|
| `list_absences` | List team absences |
| `create_absence` | Create an absence entry |
| `get_vacation_stats` | Get vacation quota/usage stats |

### Pages
| Tool | Description |
|------|-------------|
| `list_pages` | List all pages |
| `get_page` | Get page with content |
| `create_page` | Create a new page |
| `update_page_content` | Update page content |

### File Storage
| Tool | Description |
|------|-------------|
| `list_files` | List files in a folder |
| `list_folders` | List folders |
| `create_folder` | Create a new folder |
| `get_folder_tree` | Get full folder hierarchy |

### Notifications
| Tool | Description |
|------|-------------|
| `list_notifications` | List recent notifications |
| `get_unread_count` | Get unread notification count |

### Organization
| Tool | Description |
|------|-------------|
| `get_organization` | Get organization details |
| `list_members` | List team members |

## Getting Your API Token

1. Log in to your dVersum workspace
2. Go to **Settings > API Tokens**
3. Create a new token with a descriptive name (e.g. "Claude Desktop")
4. Copy the token and use it as `DVERSUM_API_TOKEN`

## Development

```bash
# Clone the repo
git clone https://github.com/dversum/mcp-server.git
cd mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run locally
DVERSUM_API_URL=http://localhost:8080/api/v1 \
DVERSUM_API_TOKEN=your-jwt-token \
node dist/bin/dversum-mcp.js
```

## License

MIT
