import { EditableText } from "@vibe/core"
import { useSelector } from "react-redux"
import { updateTask } from "../../../store/actions/board.actions"
import { addSelectedTask, removeSelectedTask } from "../../../store/actions/taskSelect.actions"
import DynamicColumn from "./DynamicColumn"
import GroupPreRow from "./GroupPreRow"
import GroupScrollableColumns from "./GroupScrollableColumns"
import GroupStickyColumns from "./GroupStickyColumns"
import TaskDetailsTriggerCell from "./TaskDetailsTriggerCell"



const GroupTableContentTask = ({ task, columnLabels, group }) => {
    const selectedTasks = useSelector(storeState => storeState.taskSelectModule.selectedTasks)

    const handleCellUpdate = (cmpType, value) => {
        const updatedTask = { ...task, [cmpType]: value }
        updateTask(group._id, updatedTask)
    }

    async function handleChangeSelect(ev, groupId, taskId) {
        if (ev.target.checked) {
            await addSelectedTask(groupId, taskId)
        } else {
            await removeSelectedTask(groupId, taskId)
        }
    }

    function handleChangeTitle(taskTitle) {
        try {
            const updatedTask = { ...task, taskTitle }
            updateTask(group._id, updatedTask)
        } catch (err) {
            console.error('task could not be updated' + err);
        }
    }

    function isTaskSelected(groupId = "", taskId = "") {
        const group = selectedTasks.find(selectedGroups => selectedGroups.groupId === groupId)
        if (!group) return false
        return group.tasks.includes(taskId)
    }

    return (<div role="listitem" className="table-task-row">
        <GroupStickyColumns>
            <GroupPreRow
                isChecked={isTaskSelected(group._id, task._id)}
                onCheckBox={(ev) => handleChangeSelect(ev, group._id, task._id)}
                group={group}
            />
            <div className="min-table-cell table-cell-first-column task-title default-cell-color" >
                <div>
                    <EditableText type="text2" onChange={handleChangeTitle} value={task.taskTitle} />
                </div>
                <TaskDetailsTriggerCell task={task} />
            </div>
        </GroupStickyColumns>
        <GroupScrollableColumns>
            {columnLabels.map(cmpType =>
                <DynamicColumn
                    key={cmpType}
                    cmpType={cmpType}
                    info={task[cmpType]}
                    onTaskUpdate={(value) => handleCellUpdate(cmpType, value)}
                />
            )}
        </GroupScrollableColumns>
    </div>)
}

export default GroupTableContentTask
