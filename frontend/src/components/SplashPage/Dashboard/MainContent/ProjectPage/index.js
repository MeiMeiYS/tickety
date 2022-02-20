import { useSelector } from 'react-redux';
import './ProjectPage.css';
import ProejctInfo from './ProjectInfo';
import KanbanBoards from './KanbanBoards';


const ProjectPage = ({ params, isMyProject, projectId }) => {

    const currentProject = useSelector((state) => state.myProjects[projectId]);


    return(
        <>
            { currentProject &&
                <>
                    <ProejctInfo params={params} isMyProject={isMyProject} projectId={projectId} currentProject={currentProject}/>
                    <KanbanBoards params={params} projectId={projectId} currentProject={currentProject}/>
                </>
            }
        </>
    )
}

export default ProjectPage;
