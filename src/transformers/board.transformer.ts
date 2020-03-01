import { Board } from '../entities/board/board.entity';
import { BoardInfoDTO } from '../dto/board/board.info';
import { NewBoardDTO } from '../dto/board/board.new';
import { extname } from 'path';
import * as uuid from 'uuid/v4';
import { UpdateBoardDTO } from '../dto/board/board.update';

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

    static fromNew(model: NewBoardDTO): Board {
        const board = new Board();
        board.titleNL = model.titleNL;
        board.titleEN = model.titleEN;
        board.textNL = model.textNL;
        board.textEN = model.textEN;
        board.photoUrl = uuid() + extname(model.image.filename);

        return board;
    }

    static update(board: Board, body: UpdateBoardDTO, needUpdateFilePath: boolean) {
        board.titleNL = body.titleNL;
        board.titleEN = body.titleEN;
        board.textNL = body.textNL;
        board.textEN = body.textEN;
        
        if (needUpdateFilePath) {
            board.photoUrl = uuid() + extname(body.image.filename);
        }

        return board;
    }
}