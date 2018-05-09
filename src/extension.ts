'use strict';
import { ExtensionContext, languages, DocumentLinkProvider, TextDocument, CancellationToken, DocumentLink, Range, Uri, workspace } from 'vscode';

export function activate(context: ExtensionContext) {
    const emailLinkProvider = new EmailLinkProvider();
    context.subscriptions.push(languages.registerDocumentLinkProvider("markdown", emailLinkProvider));
}

class EmailLinkProvider implements DocumentLinkProvider {
    provideDocumentLinks(document: TextDocument, token: CancellationToken) {
        const { handler } = workspace.getConfiguration('markDownEmailLinks');
        const text = document.getText();
        const links: DocumentLink[] = [];
        const regex = /([\+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const range = new Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            let target = Uri.parse('mailto:' + match[0]);
            switch (handler) {
                case 'fastmail': target = Uri.parse(`https://www.fastmail.com/action/compose/?mailto=${match[0]}`); break;
                case 'gmail': target = Uri.parse(`https://mail.google.com/mail/?extsrc=mailto&url=mailto:${match[0]}`); break;
                case 'outlook': target = Uri.parse(`https://outlook.office.com/owa/?path=/mail/action/compose&to=${match[0]}`); break;
                case 'yahoo': target = Uri.parse(`https://compose.mail.yahoo.com/?to=${match[0]}`); break;
            }

            links.push(new DocumentLink(range, target));
        }

        return links;
    }
}
