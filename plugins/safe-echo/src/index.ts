export type ToolDefinition = {
  name: string;
  description: string;
  optional?: boolean;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    idempotentHint?: boolean;
    destructiveHint?: boolean;
  };
  inputSchema: {
    type: "object";
    additionalProperties: false;
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (_id: string, params: { message: string }) => Promise<{
    content: Array<{ type: "text"; text: string }>;
  }>;
};

export type AgentLike = {
  addTool: (tool: ToolDefinition) => void;
};

export type PluginLike = {
  id: string;
  register: (agent: AgentLike) => void;
};

const safeEchoPlugin: PluginLike = {
  id: "safe-echo",
  register(agent) {
    agent.addTool({
      name: "safe_echo_run",
      description: "Return a text payload unchanged for demonstration and testing.",
      optional: true,
      annotations: {
        title: "Safe Echo",
        readOnlyHint: true,
        idempotentHint: true,
        destructiveHint: false
      },
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          message: {
            type: "string",
            description: "The text to echo back."
          }
        },
        required: ["message"]
      },
      async execute(_id, params) {
        return {
          content: [
            {
              type: "text",
              text: params.message
            }
          ]
        };
      }
    });
  }
};

export default safeEchoPlugin;

