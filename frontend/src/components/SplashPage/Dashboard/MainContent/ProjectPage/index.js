import { useState } from 'react';
import { useSelector } from 'react-redux';
import './ProjectPage.css';
import ThreeDotsButton from '../ThreeDotsButton';
import ProejctInfo from './ProjectInfo';


const ProjectPage = ({ params, isMyProject, projectId }) => {
    const currentProject = useSelector((state) => state.myProjects[projectId]);
    const [ showNewKanbanForm, setShowNewKanbanForm ] = useState(false);
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ errors, setErrors ] = useState([]);



    return(
        <>
            <ProejctInfo params={params} isMyProject={isMyProject} projectId={projectId} currentProject={currentProject}/>
            <div className='main-content-title'>
                <h2>Kanban boards</h2>
            </div>
            <div className='main-content-card kanban-boards'>
                {showNewKanbanForm ?
                    <>
                        <button className='new-kanban-btn active' type='button' onClick={e => setShowNewKanbanForm(false)}>
                            <i class="fa-solid fa-circle-minus"></i>
                            <span>New Kanban</span>
                        </button>
                        <form className='new-kanban-form'>
                            <div className="input-container-name">
                                <label htmlFor="new-project-name-input">
                                    Kanban name
                                </label>
                                <input
                                id="new-project-name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                />
                            </div>
                            <div className="input-container-description">
                                <label htmlFor="new-project-description-input">
                                    Description
                                </label>
                                <textarea
                                id="new-project-description-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <ul>
                                {errors.map((error, idx) => <li className="error-message" key={idx}>{error}</li>)}
                            </ul>
                            <div className='btn-group'>
                                <button className='cancel' type="button" onClick={e => setShowNewKanbanForm(false)}>Cancel</button>
                                <button className='submit' type="submit">Save</button>
                            </div>
                        </form>
                    </>
                    :
                    <button className='new-kanban-btn' type='button' onClick={e => setShowNewKanbanForm(true)}>
                        <i className="fa-solid fa-circle-plus"></i>
                        <span>New Kanban</span>
                    </button>
                }

                {currentProject?.Kanbans ? currentProject?.Kanbans.map(kanban => {
                    return (
                        <div>
                            <h3>{kanban.name}</h3>
                            <p>{kanban.description}</p>
                        </div>
                    )
                }) : <p>You have no kanban board yet</p>}
            </div>
        </>
    )
}

export default ProjectPage;
