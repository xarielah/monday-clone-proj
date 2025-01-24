import { useSelector } from "react-redux";
import GroupContainer from "./structure/GroupContainer";
import { AddGroup } from "./structure/AddGroup";


export function BoardDetails() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const selectedTasks = useSelector(storeState => storeState.taskSelectModule.selectedTasks ?? [])

    const cmpOrder = [
        "status",
        "priority",
        "members",
        "date",
    ];

    if (!board || !board.groups) return null
    return (
        <section className="board-details">
            {board.groups.map((group) => (
                <GroupContainer
                    group={group}
                    cmpOrder={cmpOrder}
                    key={group._id}
                    selectedTasks={selectedTasks}
                />
            ))}
            <AddGroup />
        </section>
    )
}
