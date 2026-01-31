/**
 * Example usage for getting jobs using the optimized API
 */

import { candidateService } from '../services/candidateService';
import { setAuthToken } from '../services/api';

// Set your JWT token for authentication
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwYTZiOGQzODUzMmY0ZjQ2MjBkMCIsImlhdCI6MTc2OTcwMDIyN30.x4j2kvS7zBNEV3HBPYdxYRcZSDXpF1AV-eMd0RJvgY4";

// Initialize authentication
setAuthToken(JWT_TOKEN);

/**
 * Get all active jobs
 */
export const getRankingJobs = async () => {
  try {
    console.log('Fetching active jobs...');
    const jobs = await candidateService.getRankingJobs();
    console.log('Active jobs fetched successfully:', jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    throw error;
  }
};

/**
 * Get active skills
 */
export const getActiveSkills = async () => {
  try {
    console.log('Fetching active skills...');
    const skills = await candidateService.getActiveSkills();
    console.log('Active skills fetched successfully:', skills);
    return skills;
  } catch (error) {
    console.error('Error fetching active skills:', error);
    throw error;
  }
};

/**
 * Example usage in a React component
 */
export const useJobData = () => {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both jobs and skills in parallel for better performance
      const [jobsData, skillsData] = await Promise.all([
        getRankingJobs(),
        getActiveSkills()
      ]);
      
      setJobs(jobsData.jobs || jobsData); // Handle different response formats
      setSkills(skillsData.skills || skillsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { jobs, skills, loading, error, refetch: fetchData };
};

// Direct usage example
const exampleUsage = async () => {
  // Set JWT token
  setAuthToken(JWT_TOKEN);
  
  // Get active jobs
  const jobs = await getRankingJobs();
  console.log('Available jobs:', jobs);
  
  // Get active skills
  const skills = await getActiveSkills();
  console.log('Available skills:', skills);
};

export default exampleUsage;
