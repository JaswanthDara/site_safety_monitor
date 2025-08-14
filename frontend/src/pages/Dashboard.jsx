import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTools, faExclamationCircle, faVest } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
  {
    title: 'Safety Incidents',
    description: 'View and manage reported safety incidents on site.',
    link: '/safety-incidents',
    color: 'bg-red-100 text-red-800',
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />,
  },
  {
    title: 'Equipment Compliance',
    description: 'Track inspection dates and compliance status of equipment.',
    link: '/equipment-compliance',
    color: 'bg-blue-100 text-blue-800',
    icon: <FontAwesomeIcon icon={faTools} size="2x" />,
  },
  {
    title: 'Hazard Reports',
    description: 'Monitor site hazards and their resolution status.',
    link: '/hazard-reports',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <FontAwesomeIcon icon={faExclamationCircle} size="2x" />,
  },
  {
    title: 'Gear Logs',
    description: 'Manage logs of safety gear issued to workers.',
    link: '/gear-logs',
    color: 'bg-green-100 text-green-800',
    icon: <FontAwesomeIcon icon={faVest} size="2x" />,
  },
];


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Welcome to the Safety Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.link)}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer ${card.color}`}
          >
            <div className="text-4xl mb-2">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
