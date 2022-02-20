import { useEffect, useState } from 'react';

import NewKanbanForm from './NewKanbanForm';
import EachKanbanCard from './EachKanbanCard';


const KanbanBoards = ({ params, projectId, currentProject }) => {
    const [ showNewKanbanForm, setShowNewKanbanForm ] = useState(false);


    return (
        <>
            <div className='main-content-title'>
                <h2>Kanban boards</h2>
            </div>
            <div className='main-content-card kanban-boards'>
                {showNewKanbanForm ?
                    <NewKanbanForm setShowNewKanbanForm={setShowNewKanbanForm} currentProject={currentProject}/>
                    :
                    <button className='new-kanban-btn' type='button' onClick={e => setShowNewKanbanForm(true)}>
                        <i className="fa-solid fa-circle-plus"></i>
                        <span>New Kanban</span>
                    </button>
                }

                {currentProject?.Kanbans?.length ? currentProject.Kanbans.map(kanban => {
                    return (
                        <EachKanbanCard kanban={kanban} params={params} key={`EachKanbanCard-${kanban.id}`}/>
                    )
                }) : <p>You have no kanban board yet</p> }
            </div>
        </>
    )
}

export default KanbanBoards;
