import { IdentifierParser } from './interface'

export interface ParsedRemoteModule {
  remoteName: string
  moduleName: string
  shareScope: string
}

class RemoteModuleParser implements IdentifierParser<ParsedRemoteModule> {
  private readonly REMOTE_MODULE_IDENTIFIER_REGEX = /remote \((.*)\) webpack\/container\/reference\/(\S+) (.+)/

  canActive(identifier: string): boolean {
    return identifier.startsWith('remote ')
  }

  parse(identifier: string): ParsedRemoteModule {
    const [, shareScope, remoteName, moduleName] = Array.from(
      identifier.match(this.REMOTE_MODULE_IDENTIFIER_REGEX) || [],
    )

    return {
      remoteName,
      moduleName: moduleName.replace(/^\.\//, ''),
      shareScope,
    }
  }
}

export const remoteModuleParser = new RemoteModuleParser()
