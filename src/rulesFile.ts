import dayjs, { Dayjs } from "dayjs";
import { Rule } from "src/types";
import { newId } from "src/utils";

/**
 * Saving and loading rules as a JSON file.
 *
 * The file looks like:
 *
 *   {
 *     "version": 1,
 *     "rules": [
 *       {
 *         "match": "LT",
 *         "title": "Late",
 *         "startTime": "14:00",
 *         "endTime": "22:00",
 *         "endsNextDay": false,
 *         "noEvent": false
 *       }
 *     ]
 *   }
 *
 * Times are local wall-clock "HH:mm", so that files don't depend on the date
 * they were exported on. `title`, `endsNextDay` and `noEvent` are optional
 * when loading, to make hand-written files easier.
 *
 * Files come from outside the app, so loading validates everything and builds
 * fresh objects, rather than trusting or spreading the parsed JSON.
 */

const FORMAT_VERSION = 1;
const FILENAME = "rotad-rules.json";

// Real files are a few kilobytes. These limits just stop a wrong file (or a
// hostile one) from locking up the page.
const MAX_FILE_BYTES = 256 * 1024;
const MAX_RULES = 500;
const MAX_TEXT_LENGTH = 200;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function serializeRules(rules: Rule[]): string {
  const file = {
    version: FORMAT_VERSION,
    rules: rules.map((rule) => ({
      match: rule.match,
      title: rule.title,
      startTime: rule.startTime.format("HH:mm"),
      endTime: rule.endTime.format("HH:mm"),
      endsNextDay: rule.endsNextDay,
      noEvent: rule.noEvent,
    })),
  };
  return JSON.stringify(file, null, 2) + "\n";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseText(
  value: unknown,
  field: string,
  position: number,
  fallback?: string,
): string {
  if (value === undefined && fallback !== undefined) {
    return fallback;
  }
  if (typeof value !== "string" || value.length > MAX_TEXT_LENGTH) {
    throw new Error(
      `Rule ${position}: "${field}" must be text of at most ${MAX_TEXT_LENGTH} characters.`,
    );
  }
  return value;
}

function parseBoolean(
  value: unknown,
  field: string,
  position: number,
  fallback: boolean,
): boolean {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== "boolean") {
    throw new Error(`Rule ${position}: "${field}" must be true or false.`);
  }
  return value;
}

function parseTime(value: unknown, field: string, position: number): Dayjs {
  const parts = typeof value === "string" ? TIME_PATTERN.exec(value) : null;
  if (parts === null) {
    throw new Error(
      `Rule ${position}: "${field}" must be a 24 hour time like "08:00".`,
    );
  }
  return dayjs()
    .startOf("day")
    .hour(Number(parts[1]))
    .minute(Number(parts[2]))
    .second(0);
}

/**
 * Parse the contents of a rules file.
 *
 * Throws an `Error` with a message suitable for showing to the user.
 */
export function parseRules(text: string): Rule[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  if (!isRecord(data) || !Array.isArray(data.rules)) {
    throw new Error("This doesn't look like a rotad rules file.");
  }
  if (data.version !== FORMAT_VERSION) {
    throw new Error(
      `This rules file has an unsupported version (expected ${FORMAT_VERSION}).`,
    );
  }
  if (data.rules.length > MAX_RULES) {
    throw new Error(
      `This file has too many rules (the limit is ${MAX_RULES}).`,
    );
  }

  return data.rules.map((raw: unknown, index: number): Rule => {
    const position = index + 1;
    if (!isRecord(raw)) {
      throw new Error(`Rule ${position} must be an object.`);
    }
    return {
      id: newId(),
      match: parseText(raw.match, "match", position),
      title: parseText(raw.title, "title", position, ""),
      startTime: parseTime(raw.startTime, "startTime", position),
      endTime: parseTime(raw.endTime, "endTime", position),
      endsNextDay: parseBoolean(
        raw.endsNextDay,
        "endsNextDay",
        position,
        false,
      ),
      noEvent: parseBoolean(raw.noEvent, "noEvent", position, false),
    };
  });
}

/**
 * Read and parse a rules file chosen by the user.
 */
export async function loadRulesFile(file: File): Promise<Rule[]> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("This file is too large to be a rotad rules file.");
  }
  return parseRules(await file.text());
}

/**
 * Prompt the browser to download the rules as a JSON file.
 */
export function downloadRules(rules: Rule[]): void {
  const blob = new Blob([serializeRules(rules)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
