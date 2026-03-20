import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Edit2, Trash2, CheckCircle, Circle, Search, Filter, Clock, ListTodo } from 'lucide-react';
import TaskModal from '../components/TaskModal';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks', {
        params: { status: statusFilter, priority: priorityFilter, search: searchQuery, sortBy, page, limit }
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [statusFilter, priorityFilter, sortBy, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { setPage(1); fetchTasks(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData._id) await axios.put(`/tasks/${taskData._id}`, taskData);
      else await axios.post('/tasks', taskData);
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try { await axios.delete(`/tasks/${id}`); fetchTasks(); } 
      catch (err) { console.error('Failed to delete task', err); }
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await axios.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-700 bg-red-100 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Low': return 'text-green-700 bg-green-100 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default: return 'text-gray-700 bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getFormatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Your Tasks</h1>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" /> New Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 transition-colors">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 ml-2" />
          <select 
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
            value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Newest First</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 dark:text-gray-300">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center shadow-sm transition-colors">
          <ListTodo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task, or clear your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${task.status === 'Completed' ? 'border-green-200 dark:border-green-800/50 bg-green-50/30 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                       <button onClick={() => handleToggleStatus(task)} className="focus:outline-none transition-transform hover:scale-110">
                          {task.status === 'Completed' ? (
                            <CheckCircle className="h-6 w-6 text-green-500 fill-current" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" />
                          )}
                       </button>
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                         {task.priority}
                       </span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-2 ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {task.title}
                  </h3>
                  <p className={`text-sm mb-4 flex-grow ${task.status === 'Completed' ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'} line-clamp-3`}>
                    {task.description || "No description provided."}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <span className="flex items-center font-medium">
                      <Clock className="w-4 h-4 mr-1.5" /> 
                      {getFormatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-10">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page <span className="text-indigo-600 dark:text-indigo-400">{page}</span> of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
