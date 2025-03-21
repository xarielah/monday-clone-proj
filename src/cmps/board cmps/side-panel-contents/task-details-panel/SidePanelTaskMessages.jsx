import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { boardService } from "../../../../services/board/board.service.local";
import { userService } from "../../../../services/user";
import { updateBoard } from "../../../../store/actions/board.actions";
import SidePanelUpdateList from "./updates/SidePanelUpdateList";
import SidePanelWriteUpdate from "./updates/SidePanelWriteUpdate";

const SidePanelTaskMessages = ({ task }) => {
    const [updates, setUpdates] = useState();
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        if (task)
            setUpdates(task.replies || [])
    }, [task])

    const onUpdateChange = (updatedUpdate) => {
        const updateIdx = updates.findIndex(update => update._id === updatedUpdate._id);
        const newUpdatesArray = [...updates];
        newUpdatesArray[updateIdx] = updatedUpdate;
        setUpdates(newUpdatesArray);
    }

    const handleUpdateReply = async (newReply) => {
        try {
            const updateIdx = updates.findIndex(update => update._id === newReply._id);
            const newUpdatesArray = [...updates];
            newUpdatesArray[updateIdx] = newReply;

            const newBoard = { ...board };
            let foundTask = false;
            for (let group of newBoard.groups) {
                const taskIndex = group.tasks.findIndex(t => t._id === task._id);
                if (taskIndex !== -1) {
                    group.tasks[taskIndex].replies = group.tasks[taskIndex].replies.map(reply =>
                        reply._id === newReply._id ? newReply : reply
                    );
                    foundTask = true;
                    break;
                }
            }
            if (!foundTask) {
                throw new Error("Task not found in board");
            }
            await updateBoard(newBoard);
            setUpdates(newUpdatesArray);
        } catch (error) {
            console.error("Error updating reply:", error);
        }
    };

    const handleNewUpdate = async (newUpdateText) => {
        try {
            const newUpdate = boardService.getEmptyReply();
            newUpdate.text = newUpdateText;
            newUpdate.groupId = task.groupId;

            const loggedUser = userService.getLoggedinUser();
            newUpdate.by = {
                _id: loggedUser._id,
                name: loggedUser.fullname,
                avatar: loggedUser.imgUrl,
            }

            const newBoard = { ...board };
            let foundTask = false;
            for (let group of newBoard.groups) {
                const taskIndex = group.tasks.findIndex(t => t._id === task._id);
                if (taskIndex !== -1) {
                    if (!group.tasks[taskIndex].replies) {
                        group.tasks[taskIndex].replies = [];
                    }
                    group.tasks[taskIndex].replies.unshift(newUpdate);
                    foundTask = true;
                    break;
                }
            }
            if (!foundTask) {
                throw new Error("Task not found in board");
            }
            await updateBoard(newBoard);
            setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
        } catch (error) {
            console.error("Error creating new update:", error);
        }
    };

    const handleRemoveReview = async (replyId) => {
        try {
            const newBoard = { ...board };
            let foundTask = false;

            for (let group of newBoard.groups) {
                const taskIndex = group.tasks.findIndex(t => t._id === task._id);
                if (taskIndex !== -1) {
                    group.tasks[taskIndex].replies = group.tasks[taskIndex].replies.filter(
                        reply => reply._id !== replyId
                    );
                    foundTask = true;
                    break;
                }
            }

            if (!foundTask) {
                throw new Error("Task not found in board");
            }

            await updateBoard(newBoard);
            setUpdates(prevUpdates => prevUpdates.filter(reply => reply._id !== replyId));

        } catch (error) {
            console.error("Error removing review:", error);
        }
    };


    if (!task) return <div>Loading comments...</div>
    return <section className="side-panel-task-messages">
        <SidePanelWriteUpdate
            onAddUpdate={handleNewUpdate}
        />
        <SidePanelUpdateList
            onUpdateChange={onUpdateChange}
            onUpdateReply={handleUpdateReply}
            onRemoveReply={handleRemoveReview}
            updates={updates}
        />
    </section>
}

export default SidePanelTaskMessages