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

## Available Tools (152)

### Clients (5)
| Tool | Description |
|------|-------------|
| `list_clients` | List all clients with pagination |
| `get_client` | Get client details |
| `create_client` | Create a new client |
| `update_client` | Update client details |
| `delete_client` | Delete a client |

### Contacts (5)
| Tool | Description |
|------|-------------|
| `list_contacts` | List all contacts |
| `get_contact` | Get contact details |
| `create_contact` | Create a new contact |
| `update_contact` | Update contact details |
| `delete_contact` | Delete a contact |

### Projects (12)
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects |
| `get_project` | Get project details |
| `create_project` | Create a new project |
| `update_project` | Update project details |
| `delete_project` | Delete a project |
| `get_project_board` | Get full kanban board (columns + tasks) |
| `list_project_members` | List project members |
| `add_project_member` | Add a member to a project |
| `remove_project_member` | Remove a member from a project |
| `get_project_time_stats` | Get project time statistics |
| `get_gantt_data` | Get Gantt chart data with dependencies |
| `create_column` | Create a kanban column |

### Tasks (16)
| Tool | Description |
|------|-------------|
| `get_task` | Get task details (assignees, subtasks, tags) |
| `create_task` | Create a task in a project column |
| `update_task` | Update task properties |
| `delete_task` | Delete a task |
| `move_task` | Move task to a different column |
| `assign_task` | Add an assignee to a task |
| `remove_assignee` | Remove an assignee from a task |
| `list_task_comments` | List comments on a task |
| `create_comment` | Add a comment to a task |
| `create_subtask` | Create a subtask (checklist item) |
| `toggle_task_done` | Toggle task completion |
| `add_tag_to_task` | Add a tag to a task |
| `remove_tag_from_task` | Remove a tag from a task |
| `archive_task` | Archive a task |
| `restore_task` | Restore an archived task |
| `move_task_to_project` | Move task to a different project |

### Time Tracking (8)
| Tool | Description |
|------|-------------|
| `list_time_entries` | List time entries (filter by date, project) |
| `create_time_entry` | Log a completed time entry |
| `update_time_entry` | Update a time entry |
| `delete_time_entry` | Delete a time entry |
| `start_timer` | Start a running timer |
| `stop_timer` | Stop a running timer |
| `get_running_timer` | Get the currently running timer |
| `get_time_stats` | Get time tracking statistics |

### Calendar (5)
| Tool | Description |
|------|-------------|
| `list_events` | List calendar events in a date range |
| `get_event` | Get event details |
| `create_event` | Create a calendar event |
| `update_event` | Update an event |
| `delete_event` | Delete an event |

### Invoices (14)
| Tool | Description |
|------|-------------|
| `list_invoices` | List invoices (filter by status, client, type) |
| `get_invoice` | Get invoice with line items and totals |
| `create_invoice` | Create a draft invoice |
| `update_invoice` | Update a draft invoice |
| `delete_invoice` | Delete a draft invoice |
| `update_invoice_status` | Change invoice status |
| `send_invoice_email` | Send invoice via email |
| `create_invoice_from_time` | Create invoice from tracked time |
| `add_invoice_line_item` | Add a line item |
| `update_invoice_line_item` | Update a line item |
| `delete_invoice_line_item` | Delete a line item |
| `record_payment` | Record a payment on an invoice |
| `create_credit_note` | Create a credit note (Gutschrift) |
| `create_cancellation` | Create a cancellation invoice (Stornorechnung) |

### Quotes (12)
| Tool | Description |
|------|-------------|
| `list_quotes` | List quotes/proposals |
| `get_quote` | Get quote with line items |
| `create_quote` | Create a draft quote |
| `update_quote` | Update a quote |
| `delete_quote` | Delete a quote |
| `update_quote_status` | Update quote status |
| `send_quote_email` | Send quote via email |
| `duplicate_quote` | Duplicate a quote |
| `convert_quote_to_invoice` | Convert accepted quote to invoice |
| `add_quote_line_item` | Add a line item |
| `update_quote_line_item` | Update a line item |
| `delete_quote_line_item` | Delete a line item |

### Recurring Invoices (8)
| Tool | Description |
|------|-------------|
| `list_recurring_invoices` | List recurring invoice templates |
| `get_recurring_invoice` | Get recurring invoice details |
| `create_recurring_invoice` | Create a recurring invoice |
| `update_recurring_invoice` | Update a recurring invoice |
| `delete_recurring_invoice` | Delete a recurring invoice |
| `pause_recurring_invoice` | Pause auto-generation |
| `resume_recurring_invoice` | Resume auto-generation |
| `generate_recurring_invoice_now` | Generate an invoice now |

### Payment Reminders (6)
| Tool | Description |
|------|-------------|
| `list_reminders` | List payment reminders (Mahnungen) |
| `get_reminder` | Get reminder details |
| `get_reminder_suggestion` | Get suggested reminder for overdue invoice |
| `create_reminder` | Create a payment reminder |
| `send_reminder_email` | Send reminder via email |
| `delete_reminder` | Delete a reminder |

### Finance (11)
| Tool | Description |
|------|-------------|
| `get_finance_overview` | Monthly revenue vs expenses |
| `get_vat_summary` | USt-Voranmeldung (KZ 81/86/66/83) |
| `list_received_invoices` | List incoming invoices |
| `get_received_invoice` | Get received invoice details |
| `approve_received_invoice` | Approve a received invoice |
| `list_suppliers` | List all suppliers |
| `get_supplier` | Get supplier details |
| `create_supplier` | Create a supplier |
| `update_supplier` | Update supplier details |
| `delete_supplier` | Delete a supplier |
| `get_datev_export` | Preview DATEV export data |

### Team Planning (5)
| Tool | Description |
|------|-------------|
| `list_absences` | List team absences |
| `create_absence` | Create an absence entry |
| `update_absence` | Update an absence |
| `delete_absence` | Delete an absence |
| `get_vacation_stats` | Get vacation quota/usage stats |

### Pages (7)
| Tool | Description |
|------|-------------|
| `list_pages` | List all pages |
| `get_page` | Get page with content |
| `create_page` | Create a new page |
| `update_page` | Update page metadata |
| `update_page_content` | Update page content |
| `delete_page` | Delete a page and children |
| `get_page_tree` | Get page tree hierarchy |

### Whiteboards (6)
| Tool | Description |
|------|-------------|
| `list_whiteboards` | List all whiteboards |
| `get_whiteboard` | Get whiteboard with content |
| `create_whiteboard` | Create a whiteboard |
| `update_whiteboard` | Update whiteboard metadata |
| `delete_whiteboard` | Delete a whiteboard |
| `duplicate_whiteboard` | Duplicate a whiteboard |

### File Storage (12)
| Tool | Description |
|------|-------------|
| `list_files` | List files in a folder |
| `get_file` | Get file details |
| `delete_file` | Delete a file |
| `get_file_download_url` | Get presigned download URL |
| `list_folders` | List folders |
| `create_folder` | Create a new folder |
| `update_folder` | Update folder name/color |
| `delete_folder` | Delete a folder and contents |
| `get_folder_tree` | Get full folder hierarchy |
| `create_share_link` | Create a WeTransfer-style share link |
| `list_share_links` | List active share links |
| `revoke_share_link` | Revoke a share link |

### Tags (4)
| Tool | Description |
|------|-------------|
| `list_tags` | List all tags |
| `create_tag` | Create a tag |
| `update_tag` | Update a tag |
| `delete_tag` | Delete a tag |

### Areas (4)
| Tool | Description |
|------|-------------|
| `list_areas` | List project areas/groups |
| `create_area` | Create a project area |
| `update_area` | Update an area |
| `delete_area` | Delete an area |

### Notifications (4)
| Tool | Description |
|------|-------------|
| `list_notifications` | List recent notifications |
| `get_unread_count` | Get unread notification count |
| `mark_notification_read` | Mark a notification as read |
| `mark_all_notifications_read` | Mark all as read |

### Organization (8)
| Tool | Description |
|------|-------------|
| `get_organization` | Get organization details |
| `update_organization` | Update organization settings |
| `list_members` | List team members |
| `invite_member` | Invite a new member via email |
| `update_member_role` | Change a member's role |
| `remove_member` | Remove a member |
| `global_search` | Search across all entities |
| `get_activity_feed` | Get recent activity feed |

## Development

```bash
# Clone the repo
git clone https://github.com/dversum/dversum.git
cd dversum/mcp-server

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
