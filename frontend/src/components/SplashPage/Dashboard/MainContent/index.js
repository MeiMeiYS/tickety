import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectPage from './ProjectPage';
import KanbanPage from './KanbanPage';
import AccountSetting from './AccountSetting';
import DashboardHome from './DashboardHome';

const MainContent = ({ params }) => {
    const myProjects = useSelector((state) => state.myProjects);
    const sessionUser = useSelector((state) => state.session.user);
    const myProjectsArray = Object.values(myProjects);
    const [ projectId, setProjectId ] = useState('');
    const [ isMyProject, setIsMyProject ] = useState(false);

    useEffect(() => {
        //set projectId
        myProjectsArray.forEach(project => {
            if (project.name === params.projectName) setProjectId(project.id);
        })
        //check if username is current user
        if (params.username === sessionUser.username) setIsMyProject(true);

    }, [params]);

    console.log(window.location.pathname)



    return (
        <div className='dashboard-main'>
            {params.username && params.projectName && !params.kanbanId &&
                <ProjectPage params={params} isMyProject={isMyProject} projectId={projectId}/>
            }
            {params.username && params.projectName && params.kanbanId &&
                <KanbanPage params={params}/>
            }
            { window.location.pathname === '/account-setting' && <AccountSetting sessionUser={sessionUser}/>}
            { window.location.pathname === '/' && <DashboardHome />}
        </div>
    )
}
export default MainContent;
