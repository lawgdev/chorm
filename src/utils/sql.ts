import sqlstring from "sqlstring";

class SQLParser {
  private readonly rawQuery: TemplateStringsArray;
  private readonly arguments: any[];

  constructor(query: TemplateStringsArray, args: any[]) {
    this.rawQuery = query;
    this.arguments = args;
  }

  get query() {
    return this.rawQuery.join("?");
  }

  get format() {
    return sqlstring.format(this.query, this.arguments);
  }
}

export function sql(query: TemplateStringsArray, ...args: any[]) {
  return new SQLParser(query, args).format;
}
