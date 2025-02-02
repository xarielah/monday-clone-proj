import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { BoardDetails } from "../cmps/board cmps/BoardDetails";
import { BoardHeader } from "../cmps/board cmps/BoardHeader";
import { CrudlBar } from "../cmps/board cmps/CrudlBar";
import { boardService } from "../services/board/board.service.local";
import { setBoard } from "../store/actions/board.actions";

export function Board() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const { boardId } = useParams();

    useEffect(() => {

        if (!board) {
            boardService.getById(boardId)
                .then(setBoard)
                .catch(console.error);
        }

    }, [board])

    if (!board) return <div>loading...</div>
    if (board)
        return (
            <section className="board-container">
                <BoardHeader />
                <BoardDetails />
                <CrudlBar />
            </section>
        )
}