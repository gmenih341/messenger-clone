import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DisplayableMessage} from '../services/types/conversation.types';
import {AuthFacade} from '../store/auth/auth.facade';
import {ConversationFacade} from '../store/conversation/conversation.facade';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
    public receivedMessage: DisplayableMessage[] = [];
    public activeQuestionId?: string;
    public isLoading$: Observable<boolean>;

    constructor (
        private readonly authFacade: AuthFacade,
        private readonly conversationFacade: ConversationFacade,
    ) {
        this.isLoading$ = this.conversationFacade.isLoading$;
    }

    public ngOnInit (): void {
        this.authFacade.authTokens$.subscribe((authToken) => {
            this.conversationFacade.startConversation(authToken);
        });

        this.conversationFacade.activeQuestionId$.subscribe(v => {
            this.activeQuestionId = v ?? undefined;
        });

        this.conversationFacade.messages$.subscribe(v => this.receivedMessage = v);
    }

    public trackById (_: number, message: DisplayableMessage): string {
        return message.id;
    }
}
