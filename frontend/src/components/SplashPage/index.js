import { useSelector } from 'react-redux';
import SplashPageContent from './SplashPageContent';
import { useParams } from 'react-router-dom';
import DashBoard from './Dashboard';
import Footer from '../Footer';

const SplashPage = () => {
    const params = useParams();
    const sessionUser = useSelector(state => state.session.user);

    return (
        <>
            { sessionUser ?
            <DashBoard params={params} /> :
            <>
                <SplashPageContent />
                <Footer />
            </>}
        </>
    )
}

export default SplashPage;
