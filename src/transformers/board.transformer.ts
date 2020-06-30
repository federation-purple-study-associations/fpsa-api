import { Board } from '../entities/board/board.entity';
import { BoardInfoDTO } from '../dto/board/board.info';
import { WriteBoardDTO } from '../dto/board/board.write';
import { extname } from 'path';
import * as uuid from 'uuid/v4';

export class BoardTransformer {
    static toInfo(list: Board[]): BoardInfoDTO[] {
        const output: BoardInfoDTO[] = [];
        for (const item of list) {
            output.push({
                id: item.id,
                title: item.titleNL || item.titleEN,
                text: item.textNL || item.textEN,
            });
        }

        return output;
    }

    static fromNew(model: WriteBoardDTO): Board {
        const board = new Board();
        board.titleNL = model.titleNL;
        board.titleEN = model.titleEN;
        board.textNL = model.textNL;
        board.textEN = model.textEN;
        board.photoUrl = uuid() + extname(model.image[0].filename);
        
        if (model.policy) {
            board.policyPlanUrl = uuid() + extname(model.policy[0].filename);

        } else {
            board.policyPlanUrl = null;
        }

        return board;
    }

    static update(board: Board, body: WriteBoardDTO, needUpdatePhoto: boolean, needUpdatePolicy: boolean) {
        board.titleNL = body.titleNL;
        board.titleEN = body.titleEN;
        board.textNL = body.textNL;
        board.textEN = body.textEN;
        
        if (needUpdatePhoto) {
            board.photoUrl = uuid() + extname(body.image[0].filename);
        }

        if (needUpdatePolicy) {
            board.policyPlanUrl = uuid() + extname(body.policy[0].filename);
        }

        return board;
    }
}