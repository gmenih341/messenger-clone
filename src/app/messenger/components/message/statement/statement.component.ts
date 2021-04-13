import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AnswerViewMessage, StatementMessage} from '../../../services/types/conversation.types';

@Component({
    selector: 'app-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementComponent {
    @Input() public statement!: StatementMessage;
}
