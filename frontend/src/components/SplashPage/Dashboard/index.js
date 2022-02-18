import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './Dashboard.css';
import Navbar from './Navbar';
import MainContent from './MainContent';
import { fetchAllMyProjects } from '../../../store/myProjects';

const Dashboard = ({ params }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchAllMyProjects()).then(() => setIsLoaded(true));
    }, [dispatch]);


    return (
        <>
            {isLoaded &&
                <div className='dashboard-content'>
                    <Navbar />
                    <MainContent params={params} />
                </div>
            }
        </>
    )
}

export default Dashboard;
