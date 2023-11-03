export class SQLParser {
  public readonly rawQuery: TemplateStringsArray;
  public readonly rawArguments: any[];

  constructor(query: TemplateStringsArray, args: any[]) {
    this.rawQuery = query;
    this.rawArguments = args;
  }

  public toString() {
    return this.rawQuery.reduce((acc, part, index) => {
      const arg = this.rawArguments[index];

      if (typeof arg === "undefined") {
        return acc + part;
      }

      return acc + part + arg;
    }, "");
  }
}

export function sql(query: TemplateStringsArray, ...args: any[]) {
  return new SQLParser(query, args);
}
