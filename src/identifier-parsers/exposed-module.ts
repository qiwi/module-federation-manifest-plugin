import { IdentifierParser } from './interface'

export interface ParsedExposedModule {
  request: string
  name?: string
}

class ExposedModuleParser implements IdentifierParser<ParsedExposedModule[]> {
  canActive(identifier: string): boolean {
    return identifier.startsWith('container entry ')
  }

  parse(identifier: string): ParsedExposedModule[] {
    const entry = identifier.replace('container entry ', '')
    const modulesJson = entry.split(' ')[1]
    const modules = JSON.parse(modulesJson)

    return modules.map((module: [request: string, exposes: { import: [src: string]; name?: string }]) => ({
      request: module[0].replace(/^\.\//, ''),
      name: module[1].name,
    }))
  }
}

export const exposedModuleParser = new ExposedModuleParser()
