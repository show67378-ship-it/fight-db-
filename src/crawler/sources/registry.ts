// parserName(DB の CrawlerSource.parserName)から実装へのマッピング。
// 新しい source を追加する際は、ここに1行足すだけでよい(仕様40)。
import type { SourceParser } from "../core/types";
import { jbjjfParser } from "../parsers/jbjjf";
import { jbcParser } from "../parsers/jbc";
import { shootoParser } from "../parsers/shooto";
import { riseParser } from "../parsers/rise";
import { jbcTransferParser } from "../parsers/jbcTransfer";
import { jbcRegisterParser } from "../parsers/jbcRegister";
import { jbcMatchParser } from "../parsers/jbcMatch";
import { rizinMmaParser, rizinKickParser } from "../parsers/rizin";
import { deepParser } from "../parsers/deep";

export const PARSER_REGISTRY: Record<string, SourceParser> = {
  jbjjf: jbjjfParser,
  jbc: jbcParser,
  shooto: shootoParser,
  rise: riseParser,
  "jbc-transfer": jbcTransferParser,
  "jbc-register": jbcRegisterParser,
  "jbc-match": jbcMatchParser,
  "rizin-mma": rizinMmaParser,
  "rizin-kick": rizinKickParser,
  deep: deepParser,
};

export function getParser(parserName: string): SourceParser | undefined {
  return PARSER_REGISTRY[parserName];
}
