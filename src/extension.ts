'use strict';
import { ExtensionContext, languages, DocumentLinkProvider, TextDocument, CancellationToken, DocumentLink, Range, Position, Uri } from 'vscode';

export function activate(context: ExtensionContext) {
    const emailLinkProvider = new EmailLinkProvider();
    context.subscriptions.push(languages.registerDocumentLinkProvider("markdown", emailLinkProvider));
    context.subscriptions.push(emailLinkProvider);
}

class EmailLinkProvider implements DocumentLinkProvider {
    constructor() {
        console.log('Instantiated');
    }

    provideDocumentLinks(document: TextDocument, token: CancellationToken) {
        const text = document.getText();
        const links: DocumentLink[] = [];
        const regex = /([\+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const range = new Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            const target = Uri.parse('mailto:' + match[0]);
            links.push(new DocumentLink(range, target));
        }
        
        return links;
    }

    dispose() {
    }
}
