import { NavLink } from 'react-router-dom';
import './SplashPage.css'
import banner_img from '../../images/Flow.png';
import splash_img1 from '../../images/Team.png'
const SplashPage = () => {
    return (
    <div className='splash-page-content'>
        <div className='banner'>
            <div className='banner-text'>
                <h1>Tickety made project managment <span>easy</span></h1>
                <p>With tickety, you can manage your work flow by stage, keep track of your tasks, and assign tasks to your teammates.</p>
                <NavLink className='banner-sign-up-btn' to="/signup">Sign Up for free</NavLink>
            </div>
            <div className='banner-img'>
                <img src={banner_img} alt='Kanban board illustration'></img>
            </div>
        </div>
        <div className='section-one'>
            <div className='section-one-text'>
                <h2>Tickety improve <span>productivity</span></h2>
                <p>Organize your tasks all in one place. Customize task cards for easy analysis and improve productivity.</p>
            </div>
            <div className='section-one-img'>
                <img src={splash_img1} alt='Team work illustration'></img>
            </div>
        </div>
    </div>
    )
}

export default SplashPage;
