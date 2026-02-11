import { useAppSelector } from "../store/hooks";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TaskTable() {
  const tasks = useAppSelector(state => state.task.tasks);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-black italic text-gray-900 uppercase">Task List</h1>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-blue-600 mt-1 uppercase transition"
            >
              <ArrowLeft size={14} /> Back to Board
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-black uppercase text-gray-400 tracking-wider">Task Title</th>
                <th className="p-4 text-xs font-black uppercase text-gray-400 tracking-wider">Description</th>
                <th className="p-4 text-xs font-black uppercase text-gray-400 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-12 text-gray-400 italic text-sm">
                    No tasks available in the List.
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 text-sm font-bold text-gray-800 uppercase italic">{task.title}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs capitalize italic truncate">{task.discription}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter
                        ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-500'}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}