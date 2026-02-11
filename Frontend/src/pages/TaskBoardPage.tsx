import { useState, useEffect } from 'react';
import { Plus, Trash2, UserPen, TableProperties, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { axiosInstance } from '../lib/axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTasks, addTask, updateTask, deleteTask } from '../store/slice/slice';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type Status = 'yet' | 'ongoing' | 'completed';

export default function TaskBoard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tasks = useAppSelector((state) => state.task.tasks);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<Status>('yet');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/task");
      dispatch(setTasks(res.data.data));
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Status;
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      const updatedTask = { ...task, status: newStatus };
      dispatch(updateTask(updatedTask));

      try {
        await axiosInstance.put(`/task/${taskId}`, { status: newStatus });
      } catch (error) {
        toast.error("Failed to sync move with server");
        fetchTasks();
      }
    }
  };

  const openModal = (task?: any) => {
    setEditingId(task?.id || null);
    setTitle(task?.title || '');
    setDesc(task?.discription || '');
    setStatus(task?.status || 'yet');
    setShowModal(true);
  };

  const saveTask = async () => {
    const data = { title, discription: desc, status };
    try {
      if (editingId) {
        const res = await axiosInstance.put(`/task/${editingId}`, data);
        dispatch(updateTask(res.data.data));
        toast.success("Task updated successfully");
      } else {
        const res = await axiosInstance.post(`/task`, data);
        dispatch(addTask(res.data.data));
        toast.success("Task created successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  const handleDelete = (id: number) => {
    toast("Delete this task?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axiosInstance.delete(`/task/${id}`);
            dispatch(deleteTask(id));
            toast.success("Task deleted successfully");
          } catch (error) {
            toast.error("Failed to delete task");
          }
        },
      },
    });
  };

 
const formatUpperCase = (value: string) => {
  return value
    .replace(/[^A-Za-z\s]/g, '') 
    .replace(/\s+/g, ' ')
    .trimStart()
    .toUpperCase();
};
const formatSentenceCase = (value: string) => {
  if (!value) return '';
  return value
    .replace(/\s+/g, ' ')    
    .trimStart()
    .toLowerCase()              
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
};

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-xl font-black italic uppercase">Task Board</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/task')} 
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition">
            <TableProperties size={18}/> View List
          </button>
          <button
           onClick={() => openModal()} 
           className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition">
          <Plus size={18}/> New Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(['yet', 'ongoing', 'completed'] as Status[]).map(colId => (
            <div key={colId} className="bg-gray-200/40 p-4 rounded-xl min-h-[500px] border border-gray-200/50 flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    {colId === 'yet' ? 'Yet to Start' : colId}
                </h2>
                <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === colId).length}
                </span>
              </div>
              
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className={`flex-1 space-y-3 transition-colors rounded-lg p-1 ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                  >
                    {tasks.filter(t => t.status === colId).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(p, s) => (
                          <div 
                            ref={p.innerRef} 
                            {...p.draggableProps} 
                            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 group transition-all 
                              ${s.isDragging ? 'shadow-2xl border-blue-400' : 'hover:border-blue-200'}`}
                          >
                            <div className="flex gap-3">
                              <div {...p.dragHandleProps} className="text-gray-300 hover:text-blue-500 cursor-grab">
                                <GripVertical size={20}/>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 italic text-sm truncate tracking-tight">
                                  {task.title}
                                </h3>
                                <p className="text-xs text-gray-500 capitalize italic truncate tracking-tight line-clamp-2 mt-1">{task.discription}</p>
                                
                                <div className="flex justify-end gap-4 mt-4 border-t border-gray-50 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openModal(task)}>
                                    <UserPen size={14} className="text-blue-400 hover:text-blue-600 transition-colors"/>
                                  </button>
                                  <button onClick={() => handleDelete(task.id)}>
                                    <Trash2 size={14} className="text-red-300 hover:text-red-500 transition-colors"/>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
             
                    {tasks.filter(t => t.status === colId).length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-300 text-[10px] font-bold uppercase">
                        No Tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
              <h2 className="font-black text-gray-800 uppercase italic tracking-tight">Manage Task</h2>
             <button
              aria-label="close"
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-red-500"
            >
              X
            </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title</label>
                <input
                 value={title} 
                onChange={e => setTitle(formatUpperCase(e.target.value))} 
                placeholder="Task title..."
                 className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status</label>
                  <select
                   value={status}
                   onChange={e => setStatus(e.target.value as Status)} 
                   className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50">
                    <option value="yet">Yet to Start</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button 
                  onClick={saveTask}
                 className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(formatSentenceCase(e.target.value))} 
                  placeholder="Task details..." 
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 h-28 resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}