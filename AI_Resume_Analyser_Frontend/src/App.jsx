import React, { useState, useEffect } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import Header from './components/Header';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AnalyzeSetup from './components/AnalyzeSetup';
import Loading from './components/Loading';
import Results from './components/Results';
import History from './components/History';

function App() {
  // Navigation / View State
  // Views: 'landing' | 'login' | 'signup' | 'dashboard' | 'analyze_setup' | 'loading' | 'results' | 'history'
  const [view, setView] = useState('landing')

  // User Authentication State
  const [user, setUser] = useState(null) // { email, username, role: 'USER' }
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  // Upload Module State
  const [uploadedFile, setUploadedFile] = useState(null) // { name, size, type }
  const [dragActive, setDragActive] = useState(false)
  const [roleInput, setRoleInput] = useState('')
  const [experienceInput, setExperienceInput] = useState('')
  const [jdInput, setJdInput] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Loading Step state
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStepText, setLoadingStepText] = useState('Initializing...')

  // Analysis Output State
  const [currentAnalysis, setCurrentAnalysis] = useState(null)

  // History State
  const [historyList, setHistoryList] = useState([])
  const [historySearchQuery, setHistorySearchQuery] = useState('')

  // Jobs State
  const [matchingJobs, setMatchingJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  // (admin panel removed)

  // (admin panel removed)

  // Load history whenever user changes or navigates to history
  useEffect(() => {
    if (user && user.token && (view === 'history' || view === 'dashboard' || view === 'results')) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/history`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Flatten backend structure to match frontend expectations
          const formatted = Array.isArray(data) ? data.map(item => ({
            ...item,
            id: item.resume?.id || item.id,
            fileName: item.resume?.fileName || 'resume_doc.pdf',
            role: item.resume?.roleApplied || 'Unknown',
            experience: item.resume?.experienceYears || 0,
            date: item.analyzedAt || new Date().toISOString(),
            skills: {
              hard: [],
              soft: [],
              missing: []
            },
            suggestions: item.suggestions ? JSON.parse(item.suggestions) : []
          })) : [];
          setHistoryList(formatted);
        })
        .catch(err => console.error('Failed to fetch history', err))
    } else if (!user) {
      setHistoryList([])
    }
  }, [user, view])

  // Fetch matching jobs from RapidAPI JSearch when viewing results
  useEffect(() => {
    if (view === 'results' && currentAnalysis) {
      setLoadingJobs(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/match?role=${encodeURIComponent(currentAnalysis.role)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data) { // JSearch returns items in a 'data' array
            setMatchingJobs(data.data.slice(0, 6)); // Top 6 jobs
          } else {
            setMatchingJobs([]);
          }
          setLoadingJobs(false);
        })
        .catch(err => {
          console.error("Failed to fetch jobs", err);
          setLoadingJobs(false);
        });
    }
  }, [currentAnalysis, view]);

  // Authentication Handlers
  const handleSignIn = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!loginEmail || !loginPassword) {
      setAuthError('All fields are required.')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ email: data.email, username: data.username, role: data.role, token: data.token });
        localStorage.setItem('nexus_token', data.token);
        setAuthSuccess(`Welcome back, ${data.username}!`);
        setTimeout(() => {
          setView('dashboard')
          setAuthSuccess('')
        }, 1000)
      } else {
        const errText = await res.text();
        setAuthError(errText || 'Invalid email or password.');
      }
    } catch (error) {
      setAuthError('Failed to connect to the server.');
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setAuthError('All fields are required.')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupUsername, email: signupEmail, password: signupPassword })
      });
      if (res.ok) {
        setAuthSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          setLoginEmail(signupEmail)
          setLoginPassword(signupPassword)
          setAuthSuccess('')
          setView('login')
        }, 1500)
      } else {
        const errText = await res.text();
        setAuthError(errText || 'Failed to register account.');
      }
    } catch (error) {
      setAuthError('Failed to connect to the server.');
    }
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('nexus_token')
    setUploadedFile(null)
    setCurrentAnalysis(null)
    setView('landing')
  }

  // File drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (file) => {
    if (!file) return
    const extension = file.name.split('.').pop().toLowerCase()
    if (extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      alert('Unsupported file type. Please upload a PDF or Microsoft Word (.docx) document.')
      return
    }

    setUploadedFile({
      fileObj: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'application/octet-stream'
    })

    // Automatically navigate to Details setup page
    setView('analyze_setup')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  // Form Submit Handler (Posts real FormData to Backend)
  const handleAnalyzeSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!roleInput.trim()) errors.role = 'Target job role is essential.'
    if (!experienceInput.trim() || isNaN(experienceInput) || Number(experienceInput) < 0) {
      errors.experience = 'Please enter a valid positive number for experience.'
    }

    if (!uploadedFile || !uploadedFile.fileObj) {
      errors.role = 'Please ensure a resume file is uploaded.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setView('loading')
    setLoadingProgress(50)
    setLoadingStepText('Sending resume to NEXUS backend and awaiting AI evaluation (this may take a moment)...')

    const formData = new FormData();
    formData.append('file', uploadedFile.fileObj);
    formData.append('role', roleInput);
    formData.append('experience', experienceInput);
    if (jdInput) formData.append('jobDescription', jdInput);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();

        // Map backend Analysis entity to frontend format
        let suggestionsList = [];
        let parsedData = {};
        try {
          if (data.suggestions && data.suggestions !== '[]') {
            parsedData = JSON.parse(data.suggestions);
            // Handle both array format and full JSON object format
            if (Array.isArray(parsedData)) {
                suggestionsList = parsedData;
            } else if (parsedData.suggestions) {
                suggestionsList = parsedData.suggestions;
            }
          }
        } catch (e) { }

        const newAnalysis = {
          id: data.id,
          fileName: uploadedFile.name,
          role: roleInput,
          experience: experienceInput,
          atsScore: data.atsScore,
          roleMatch: data.roleMatchScore,
          expScore: data.experienceScore,
          date: data.analyzedAt || new Date().toISOString(),
          skills: {
            hard: parsedData.matchedHardSkills || [],
            soft: parsedData.matchedSoftSkills || [],
            missing: parsedData.missingSkills || []
          },
          suggestions: suggestionsList,
          feedback: data.overallFeedback
        };

        setLoadingProgress(100);
        setLoadingStepText('Analysis complete!');
        setCurrentAnalysis(newAnalysis);
        setView('results');
      } else {
        const errorText = await res.text();
        alert('Analysis failed: ' + errorText);
        setView('analyze_setup');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the backend server.');
      setView('analyze_setup');
    }
  }

  const handleDeleteHistory = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setHistoryList(historyList.filter(item => item.id !== id));
      } else {
        alert('Failed to delete history record.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting history record.');
    }
  }

  // PDF Print Trigger
  const handlePrintReport = () => {
    window.print()
  }

  // Search filter for history
  const filteredHistory = historyList.filter(item =>
    item.role.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    item.fileName.toLowerCase().includes(historySearchQuery.toLowerCase())
  )

  // CSS Circular progress calculations
  const calculateCircleDash = (score) => {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    return { circumference, offset }
  }

  // Color mapper for scores
  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981' // emerald
    if (score >= 50) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  // Sub-components as local renderers


  // Active view routing manager
  const renderCurrentView = () => {
    switch (view) {
      case 'landing': return <Landing user={user} setView={setView} />;
      case 'login': return <Login loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} authError={authError} setAuthError={setAuthError} authSuccess={authSuccess} setAuthSuccess={setAuthSuccess} handleSignIn={handleSignIn} setView={setView} />;
      case 'signup': return <Signup signupUsername={signupUsername} setSignupUsername={setSignupUsername} signupEmail={signupEmail} setSignupEmail={setSignupEmail} signupPassword={signupPassword} setSignupPassword={setSignupPassword} signupConfirmPassword={signupConfirmPassword} setSignupConfirmPassword={setSignupConfirmPassword} authError={authError} setAuthError={setAuthError} authSuccess={authSuccess} setAuthSuccess={setAuthSuccess} handleSignUp={handleSignUp} setView={setView} />;
      case 'dashboard': return <Dashboard dragActive={dragActive} handleDrag={handleDrag} handleDrop={handleDrop} handleFileInput={handleFileInput} />;
      case 'analyze_setup': return <AnalyzeSetup uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} setView={setView} handleAnalyzeSubmit={handleAnalyzeSubmit} roleInput={roleInput} setRoleInput={setRoleInput} formErrors={formErrors} experienceInput={experienceInput} setExperienceInput={setExperienceInput} jdInput={jdInput} setJdInput={setJdInput} />;
      case 'loading': return <Loading loadingProgress={loadingProgress} loadingStepText={loadingStepText} />;
      case 'results': return <Results currentAnalysis={currentAnalysis} setView={setView} handlePrintReport={handlePrintReport} loadingJobs={loadingJobs} matchingJobs={matchingJobs} />;
      case 'history': return <History historyList={historyList} historySearchQuery={historySearchQuery} setHistorySearchQuery={setHistorySearchQuery} setCurrentAnalysis={setCurrentAnalysis} setView={setView} handleDeleteHistory={handleDeleteHistory} filteredHistory={filteredHistory} />;
      default: return <Landing user={user} setView={setView} />;
    }
  }

  return (
    <div className="app-container">
      <Header view={view} setView={setView} user={user} handleSignOut={handleSignOut} setAuthError={setAuthError} setAuthSuccess={setAuthSuccess} />
      {renderCurrentView()}
      <footer className="mt-auto py-4 px-3 border-top border-light border-opacity-10 text-center animate-fadein print-hide">
        <div className="container">
          <p className="text-secondary small mb-0">
            © 2026 NEXUS Resume Analyzer Inc. Built using React.js and Spring Boot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App;
