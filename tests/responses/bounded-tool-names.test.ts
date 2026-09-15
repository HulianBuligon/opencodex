import { describe, expect, test } from "bun:test";
import { dottedToolName, namespacedToolName } from "../../src/types/tools";

describe("bounded tool wire names (#4679)", () => {
  test("keeps flat names at or under the 64-char wire limit unchanged", () => {
    expect(namespacedToolName(undefined, "exec_command")).toBe("exec_command");
    expect(namespacedToolName("collaboration", "spawn_agent")).toBe("collaboration__spawn_agent");
    expect(dottedToolName("collaboration", "spawn_agent")).toBe("collaboration.spawn_agent");
  });

  test("aliases flattened names past the 64-char gateway bound deterministically", () => {
    const namespace = "mcp__codex_apps__safety_settings";
    const name = "prepare_parental_control_update";
    expect(`${namespace}__${name}`.length).toBe(65);
    const first = namespacedToolName(namespace, name);
    expect(first.length).toBeLessThanOrEqual(64);
    expect(first.startsWith("mcp__codex_apps__safety_settings__")).toBe(true);
    // Same identity, same alias — stable across calls and process restarts.
    expect(namespacedToolName(namespace, name)).toBe(first);
    expect(dottedToolName(namespace, name)).toBe(first);
  });

  test("distinct identities keep distinct bounded wire names within one namespace", () => {
    const namespace = "mcp__codex_apps__codex_document_control";
    const a = namespacedToolName(namespace, "get_document_tool_schemas");
    const b = namespacedToolName(namespace, "execute_document_command");
    expect(a.length).toBeLessThanOrEqual(64);
    expect(b.length).toBeLessThanOrEqual(64);
    expect(a).not.toBe(b);
  });

  test("bare names past the bound are aliased too", () => {
    const name = "a_very_long_client_declared_function_name_exceeding_the_gateway_limit";
    expect(name.length).toBeGreaterThan(64);
    const wire = namespacedToolName(undefined, name);
    expect(wire.length).toBeLessThanOrEqual(64);
    expect(namespacedToolName(undefined, name)).toBe(wire);
  });
});
