import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, createAction, props} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {ConversationService} from '../../services/conversation.service';
import {PollpassMessage} from '../../services/types/conversation.types';
import {ErrorProps} from '../types/auth.state';
import {AddMessageProps, SetHistoryProps} from '../types/conversation.state';

export const ConversationActions = {
    startConversation: createAction('[Convo] start', props<{authToken: string}>()),

    setHistory: createAction('[Convo] history', props<SetHistoryProps>()),
    addMessage: createAction('[Convo] message', props<AddMessageProps>()),

    answerQuestion: createAction('[Convo] error', props<ErrorProps>()),
    updateHeartbeat: createAction('[Convo] heartbeat', props<{at: Date}>()),

    invalidMessage: createAction('[Convo] invalid', props<AddMessageProps>()),
};

@Injectable()
export class ConversationEffects {
    public startConversation$ = createEffect(() => this.actions$.pipe(
        ofType(ConversationActions.startConversation),
        exhaustMap(action =>
            this.conversationService.connectWithToken(action.authToken).pipe(
                map(message => this.distributeMessage(message)),
                catchError(() => of(ConversationActions.setHistory({messages: []}))),
            ),
        ),
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly conversationService: ConversationService,
    ) {}

    private distributeMessage (message: PollpassMessage): Action {
        switch (message.kind) {
            case 'AnswerView':
            case 'Question':
            case 'Statement':
                return ConversationActions.addMessage({message});
            case 'History':
                return ConversationActions.setHistory({messages: message.messages});
            default:
                return ConversationActions.invalidMessage({message});
        }
    }
}
