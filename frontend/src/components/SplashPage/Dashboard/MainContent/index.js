import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import ProjectPage from './ProjectPage';
import KanbanPage from './KanbanPage';
import AccountSetting from './AccountSetting';
import DashboardHome from './DashboardHome';

const MainContent = ({ params }) => {
    const history = useHistory();
    const myProjects = useSelector((state) => state.myProjects);
    const sessionUser = useSelector((state) => state.session.user);
    const myProjectsArray = Object.values(myProjects);
    const [ projectId, setProjectId ] = useState('');
    const [ isMyProject, setIsMyProject ] = useState(false);

    let found;

    useEffect(() => {

        //check if username is current user
        if (params.username && params.username === sessionUser.username) setIsMyProject(true);
        else if (params.username && params.username !== sessionUser.username) {
            return history.push('/');
        }

        if (params.username && params.projectName){
            let found = false;
            //set projectId
            myProjectsArray.forEach(project => {
                if (project.name === params.projectName) {
                    setProjectId(project.id);
                    found = true;
                }
            })
            if (!found) return history.push('/');
        }

        return () => {
            found = false;
        };

    }, [params]);




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
