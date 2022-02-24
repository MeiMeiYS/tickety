import "./DashboardHome.css";
import mei from "../../../../../images/mei.jpg";

const DashboardHome = () => {
  const goToLinkedIn = (e) => {
    e.preventDefault();
    window.open("https://www.linkedin.com/in/meiyinshih/");
  };

  const goToGithub = (e) => {
    e.preventDefault();
    window.open("https://github.com/MeiMeiYS");
  };

  const goToMyWeb = (e) => {
    e.preventDefault();
    window.open("https://meiys.me/");
  };

  const goToRepo = (e) => {
    e.preventDefault();
    window.open("https://github.com/MeiMeiYS/tickety");
  };

  return (
    <>
      <div className="main-content-card about-creator">
        <h2>About the Developer - Mei Shih</h2>
        <div className="about-content">
          <div className="avatar">
            <img src={mei}></img>
          </div>
          <p>
            Mei Shih is a full stack software engineer with a formal background
            in fashion design. She always have a strong passion for fashion,
            technology, and the intimate connection between them. Mei is a
            graduate of App Academy 24 weeks full time program. During the
            program, she has learned JavaScript, React, Express.js, Python,
            problem solving, and pair programming. She is excited to join the
            adventure of tech development field. In addition, Mei is a fast
            learner with a flexible personality, and is now looking for
            opportunity in tech industry.
          </p>
        </div>
        <div className="my-links">
          <button type="button" onClick={goToLinkedIn}>
            <i className="fab fa-linkedin-in"></i>
          </button>
          <button type="button" onClick={goToGithub}>
            <i className="fab fa-github"></i>
          </button>
          <button type="button" onClick={goToMyWeb}>
            <i className="fa-solid fa-m"></i>
          </button>
        </div>
      </div>

      <div className="main-content-card about-this-app">
        <h2>About this app</h2>
        <div className="about-content">
          <p>
            Tickety is an app where you can manage your work flow by stages and
            keep track of your tasks. Tickety app is designed & coded by Mei
            Shih using React as frontend, Express as backend, and used
            PostgreSQL/Sequelize to setup database. Tickety app is built in 10
            days in 2022 February. It is Mei's capstone project at App Academy.
            The most challenging part of building this app for Mei is
            implementing the drag and drop task card on the kanban board and
            dynamically updating the frontend state and backend data with no
            animation delay. Check out the Tickety GitHub repo{" "}
            <span className="repo-link" onClick={goToRepo}>
              here
            </span>
            .
          </p>
        </div>
      </div>
      <div className="main-content-card about-this-app">
        <h2>Future updates</h2>
        <div className="about-content">
          <p>Here are some up coming features in the near future:</p>
          <ul className='future-updates'>
            <li>
              You will be able to invite teammates via email or username to edit
              your projects.
            </li>
            <li>
              You can assign task to any teammate and their avatar will show on
              the task card.
            </li>
            <li>You can set color of every single task card.</li>
            <li>You can see who is the last user to update a task card.</li>
            <li>
              You will get notification when teammates create/edit/delete your
              project.
            </li>
            <li>
              You can archive a project or kanban. The Archived project or
              kanban will be in the archived section.
            </li>
            <li>Teammates can comment on task card.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
