import { SourceCode } from "./sourceCode";
export type Level = {
  id: number;
  name: string;
};

export type LevelEnriched = Level & { sourceCodes: SourceCode[] };
