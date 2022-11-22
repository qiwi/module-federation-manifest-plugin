export interface IdentifierParser<T> {
  canActive(identifier: string): boolean
  parse(identifier: string): T
}
